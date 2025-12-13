import type {
  Config,
  DataProvider,
  ArticleViewProps,
  FileBrowserViewProps,
  NoRepoFoundViewProps,
  LandingViewProps,
} from 'madea-blog-core';
import { GitHubDataProvider } from 'madea-blog-core/providers/github';
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

// Import the actual view components
import FileBrowser, { NoRepoFound } from '@/app/components/file-browser';
import { MarkdownView } from '@/app/components/markdown-view';
import LandingPage from '@/app/components/landing-page';

export const FIXED_REPO_NAME = 'madea.blog';

// ============================================
// View Adapters
// These wrap the existing components to match
// the core's view props contracts
// ============================================

function ArticleView(props: ArticleViewProps) {
  return <MarkdownView {...props} />;
}

function FileBrowserView(props: FileBrowserViewProps) {
  return <FileBrowser {...props} />;
}

function NoRepoFoundView(props: NoRepoFoundViewProps) {
  return <NoRepoFound {...props} />;
}

function LandingView(_props: LandingViewProps) {
  return <LandingPage />;
}

// ============================================
// Data Provider Factory
// Creates the appropriate provider based on
// environment and configuration
// ============================================

export interface CreateProviderOptions {
  username: string;
  useLocalFs?: boolean;
  localContentDir?: string;
  token?: string;
}

export function createDataProvider(options: CreateProviderOptions): DataProvider {
  const { username, useLocalFs, localContentDir, token } = options;

  if (useLocalFs) {
    const contentDir = localContentDir || 'test';
    console.log(`[DataProvider] Using LocalFsDataProvider: ${contentDir}`);
    return new LocalFsDataProvider({
      contentDir,
      authorName: username,
      sourceUrl: `file://${contentDir}`,
    });
  }

  const githubToken = token || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN or GITHUB_PAT environment variable is required for GitHub mode');
  }

  console.log(`[DataProvider] Using GitHubDataProvider: ${username}/${FIXED_REPO_NAME}`);
  return new GitHubDataProvider({
    username,
    repo: FIXED_REPO_NAME,
    token: githubToken,
  });
}

// ============================================
// Config Factory
// Creates a complete Config object with all
// injected dependencies
// ============================================

export interface CreateConfigOptions {
  username: string;
  useLocalFs?: boolean;
  localContentDir?: string;
  token?: string;
}

export function createMadeaConfig(options: CreateConfigOptions): Config {
  const dataProvider = createDataProvider(options);

  return {
    dataProvider,
    username: options.username,
    fileBrowserView: FileBrowserView,
    articleView: ArticleView,
    noRepoFoundView: NoRepoFoundView,
    landingView: LandingView,
  };
}

// ============================================
// Default Config Helper
// Creates config from environment variables
// and the username from middleware
// ============================================

export function createDefaultConfig(username: string): Config {
  return createMadeaConfig({
    username,
    useLocalFs: process.env.USE_LOCAL_FS === 'true',
    localContentDir: process.env.LOCAL_CONTENT_DIR,
  });
}

// ============================================
// Local Filesystem Config Helper
// Creates config for local filesystem mode
// ============================================

export function createLocalConfig(contentDir: string): Config {
  return createMadeaConfig({
    username: 'local',
    useLocalFs: true,
    localContentDir: contentDir,
  });
}
