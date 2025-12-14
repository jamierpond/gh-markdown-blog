import type { DataProvider, FileInfo, CommitInfo, SourceInfo } from '../data-provider.js';
import { extractTitle, isMarkdownFile } from '../utils.js';

const TEN_MINUTES_SECONDS = 60 * 10;
const ONE_DAY_SECONDS = 60 * 60 * 24;

interface GitHubOptions {
  username: string;
  repo: string;
  token?: string;
  subDir?: string;
}

interface GitHubTreeItem {
  path: string;
  sha: string;
  url: string;
  type: string;
}

interface GitHubCommit {
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubUser {
  name?: string;
  bio?: string;
  avatar_url?: string;
  login: string;
}

interface GitHubFileContent {
  content: string;
  encoding: BufferEncoding;
  sha: string;
  html_url: string;
}

// Extended fetch options for Next.js
interface NextFetchRequestInit extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export class GitHubDataProvider implements DataProvider {
  private readonly username: string;
  private readonly repo: string;
  private readonly token?: string;
  private readonly repoPath: string;
  private readonly subDir?: string;
  private cachedBranch?: string;
  private cachedUser: GitHubUser | null | undefined;

  constructor(options: GitHubOptions) {
    this.username = options.username;
    this.repo = options.repo;
    this.token = options.token;
    this.repoPath = `${options.username}/${options.repo}`;
    this.subDir = options.subDir?.replace(/^\/|\/$/g, ''); // normalize: remove leading/trailing slashes
  }

  private async fetchFromGitHub<T>(url: string, cacheSeconds: number = TEN_MINUTES_SECONDS): Promise<T> {
    if (!this.token) {
      throw new Error('GitHub token is required for GitHubDataProvider');
    }

    const options: NextFetchRequestInit = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${this.token}`,
      },
      cache: 'force-cache',
      next: { revalidate: cacheSeconds },
    };

    const res = await fetch(url, options as RequestInit);

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }

  private async fetchGitHubUser(username: string): Promise<GitHubUser | null> {
    if (this.cachedUser !== undefined) {
      return this.cachedUser;
    }

    try {
      const options: NextFetchRequestInit = {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      };

      const response = await fetch(`https://api.github.com/users/${username}`, options as RequestInit);
      if (!response.ok) {
        this.cachedUser = null;
        return null;
      }
      const userData = await response.json() as GitHubUser;
      this.cachedUser = userData;
      return userData;
    } catch {
      this.cachedUser = null;
      return null;
    }
  }

  async getDefaultBranch(): Promise<string> {
    if (this.cachedBranch) {
      return this.cachedBranch;
    }

    const data = await this.fetchFromGitHub<{ default_branch: string }>(
      `https://api.github.com/repos/${this.repoPath}`,
      ONE_DAY_SECONDS
    );
    this.cachedBranch = data.default_branch;
    return data.default_branch;
  }

  private async getFileContent(filePath: string): Promise<string> {
    const branch = await this.getDefaultBranch();
    const url = `https://api.github.com/repos/${this.repoPath}/contents/${filePath}?ref=${branch}`;
    const data = await this.fetchFromGitHub<GitHubFileContent>(url, TEN_MINUTES_SECONDS);
    return Buffer.from(data.content, data.encoding).toString('utf-8');
  }

  private async getCommitInfo(filePath: string): Promise<CommitInfo> {
    const commits = await this.fetchFromGitHub<GitHubCommit[]>(
      `https://api.github.com/repos/${this.repoPath}/commits?path=${filePath}&per_page=1`
    );

    if (!commits || commits.length === 0) {
      return {
        date: new Date().toISOString(),
        authorName: this.username,
        authorEmail: undefined,
        authorUsername: this.username,
        authorAvatarUrl: `https://github.com/${this.username}.png`,
      };
    }

    const lastCommit = commits[0];
    return {
      date: lastCommit.commit.author.date,
      authorName: lastCommit.commit.author.name,
      authorEmail: lastCommit.commit.author.email,
      authorUsername: lastCommit.author?.login,
      authorAvatarUrl: lastCommit.author?.avatar_url,
    };
  }

  async getArticleList(): Promise<FileInfo[]> {
    const branch = await this.getDefaultBranch();
    const treeUrl = `https://api.github.com/repos/${this.repoPath}/git/trees/${branch}?recursive=1`;
    const data = await this.fetchFromGitHub<{ tree: GitHubTreeItem[] }>(treeUrl, TEN_MINUTES_SECONDS);

    const subDirPrefix = this.subDir ? `${this.subDir}/` : '';

    const markdownFiles = data.tree.filter((item: GitHubTreeItem) => {
      if (item.type !== 'blob' || !isMarkdownFile(item.path)) {
        return false;
      }
      // If subDir is set, only include files within that directory
      if (this.subDir && !item.path.startsWith(subDirPrefix)) {
        return false;
      }
      return true;
    });

    const articles: FileInfo[] = await Promise.all(
      markdownFiles.map(async (file: GitHubTreeItem) => {
        // Strip subDir prefix from path for routing
        const routePath = this.subDir
          ? file.path.slice(subDirPrefix.length)
          : file.path;

        try {
          const [content, commitInfo] = await Promise.all([
            this.getFileContent(file.path),
            this.getCommitInfo(file.path),
          ]);

          return {
            path: routePath,
            content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
            sha: file.sha,
            url: `https://github.com/${this.repoPath}/blob/${branch}/${file.path}`,
            commitInfo,
            title: extractTitle(content, file.path),
          };
        } catch {
          // Fallback for files that can't be fetched
          const fallbackCommitInfo: CommitInfo = {
            date: new Date().toISOString(),
            authorName: this.username,
            authorEmail: undefined,
            authorUsername: this.username,
            authorAvatarUrl: `https://github.com/${this.username}.png`,
          };

          const fallbackTitle = file.path
            .replace(/\.(md|mdx)$/, '')
            .replace(/[-_]/g, ' ')
            .split('/')
            .pop() || file.path;

          return {
            path: routePath,
            content: '',
            sha: file.sha,
            url: `https://github.com/${this.repoPath}/blob/${branch}/${file.path}`,
            commitInfo: fallbackCommitInfo,
            title: fallbackTitle,
          };
        }
      })
    );

    // Sort by newest first
    articles.sort((a, b) => {
      return new Date(b.commitInfo.date).getTime() - new Date(a.commitInfo.date).getTime();
    });

    return articles;
  }

  async getArticle(articlePath: string): Promise<FileInfo | null> {
    try {
      const branch = await this.getDefaultBranch();
      // Prepend subDir to get the full path in the repo
      const fullPath = this.subDir ? `${this.subDir}/${articlePath}` : articlePath;

      const [content, commitInfo] = await Promise.all([
        this.getFileContent(fullPath),
        this.getCommitInfo(fullPath),
      ]);

      // Get the file SHA
      const url = `https://api.github.com/repos/${this.repoPath}/contents/${fullPath}?ref=${branch}`;
      const fileData = await this.fetchFromGitHub<GitHubFileContent>(url, TEN_MINUTES_SECONDS);

      return {
        path: articlePath, // Return the route path (without subDir)
        content,
        sha: fileData.sha,
        url: `https://github.com/${this.repoPath}/blob/${branch}/${fullPath}`,
        commitInfo,
        title: extractTitle(content, fullPath),
      };
    } catch {
      return null;
    }
  }

  async getSourceInfo(): Promise<SourceInfo> {
    const [user, branch] = await Promise.all([
      this.fetchGitHubUser(this.username),
      this.getDefaultBranch(),
    ]);
    const sourceUrl = this.subDir
      ? `https://github.com/${this.repoPath}/tree/${branch}/${this.subDir}`
      : `https://github.com/${this.repoPath}`;

    return {
      name: user?.name || this.username,
      bio: user?.bio || undefined,
      avatarUrl: user?.avatar_url || `https://github.com/${this.username}.png`,
      sourceUrl,
    };
  }
}
