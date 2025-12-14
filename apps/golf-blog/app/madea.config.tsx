import type { MadeaConfigWithSeo, ArticleViewProps, FileBrowserViewProps, NoRepoFoundViewProps, FileInfo } from 'madea-blog-core';
import { generateMetadataForIndex, generateMetadataForArticle } from 'madea-blog-core';
import { GitHubDataProvider } from 'madea-blog-core/providers/github';
import Link from 'next/link';
import Markdown from 'react-markdown';

const USERNAME = 'jamierpond';
const REPO = 'madea.blog';

function ArticleView({ article, username, branch }: ArticleViewProps) {
  const sourceUrl = `https://github.com/${username}/${REPO}/blob/${branch}/${article.path}`;
  return (
    <div>
      <Link href="/">← Back</Link>
      <h1>{article.title}</h1>
      <p>{new Date(article.commitInfo.date).toLocaleDateString()} · <a href={sourceUrl}>Source</a></p>
      <Markdown>{article.content}</Markdown>
    </div>
  );
}

function FileBrowserView({ articles, sourceInfo }: FileBrowserViewProps) {
  return (
    <div>
      <h1>{sourceInfo.name}</h1>
      {sourceInfo.bio && <p>{sourceInfo.bio}</p>}
      <ul>
        {articles.map((a: FileInfo) => (
          <li key={a.sha}>
            <Link href={`/${a.path}`}>{a.title}</Link>
            <small> ({new Date(a.commitInfo.date).toLocaleDateString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoRepoFoundView({ username }: NoRepoFoundViewProps) {
  return <p>Could not find {username}/{REPO}</p>;
}

function LandingView() {
  return <h1>Welcome</h1>;
}

const BASE_URL = 'https://golf-blog.example.com';

const SEO_CONFIG = {
  baseUrl: BASE_URL,
  siteName: `Jamie's minimal blog`,
  defaultDescription: 'A minimal blog',
  authorName: 'jamierpond',
  authorUrl: 'https://github.com/jamierpond',
} as const;

export function createBlogConfig(): MadeaConfigWithSeo {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  if (!token) throw new Error('GITHUB_TOKEN or GITHUB_PAT required');

  return {
    dataProvider: new GitHubDataProvider({ username: USERNAME, repo: REPO, token }),
    username: USERNAME,
    fileBrowserView: FileBrowserView,
    articleView: ArticleView,
    noRepoFoundView: NoRepoFoundView,
    landingView: LandingView,
    seo: SEO_CONFIG,
    basePath: '',
  };
}

// Metadata helpers for pages
export async function generateBlogMetadata() {
  const config = createBlogConfig();
  return generateMetadataForIndex(config, {
    title: 'Golf Blog',
    description: 'A minimal golf blog',
  });
}

export async function generateArticleMetadata(slug: string[]) {
  const config = createBlogConfig();
  return generateMetadataForArticle(config, slug);
}
