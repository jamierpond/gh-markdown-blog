/** Data from the last commit */
export interface CommitInfo {
  date: string; // ISO string (e.g., '2025-12-12T17:00:00Z')
  authorName: string;
  authorEmail?: string;
  authorUsername?: string;
  authorAvatarUrl?: string;
}

/** Normalized blog article data */
export interface FileInfo {
  path: string; // Relative path (used for routing)
  content: string; // Raw markdown
  sha: string; // Unique ID (Git SHA or file hash)
  url: string; // URL to source (GitHub link or local path)
  commitInfo: CommitInfo;
  title: string; // Extracted from content
}

/** Normalized source/author info for the homepage */
export interface SourceInfo {
  name: string;
  bio?: string;
  avatarUrl?: string;
  sourceUrl: string; // Link to the repo or directory
}

/** The main contract for all data sources */
export interface DataProvider {
  getArticleList(): Promise<FileInfo[]>;
  getArticle(path: string): Promise<FileInfo | null>;
  getSourceInfo(): Promise<SourceInfo>;
  getDefaultBranch(): Promise<string>;
}

// ============================================
// View Props Contracts
// These define the props that the core logic
// will pass to user-provided view components
// ============================================

/** Props for the article/markdown view component */
export interface ArticleViewProps {
  article: FileInfo;
  username: string;
  branch: string;
}

/** Props for the file browser/article list view component */
export interface FileBrowserViewProps {
  articles: FileInfo[];
  sourceInfo: SourceInfo;
  username: string;
}

/** Props for the "no repo found" view component */
export interface NoRepoFoundViewProps {
  username: string;
}

/** Props for the landing page view component (shown when no subdomain) */
export interface LandingViewProps {
  // Currently no props needed, but defined for future extensibility
}
