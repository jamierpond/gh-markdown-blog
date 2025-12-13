import type { DataProvider } from 'madea-blog-core';
import { GitHubDataProvider } from 'madea-blog-core/providers/github';
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

export const FIXED_REPO_NAME = 'madea.blog';

let cachedProvider: DataProvider | null = null;
let cachedUsername: string | null = null;

export function getDataProvider(username: string): DataProvider {
  // Return cached provider if username matches
  if (cachedProvider && cachedUsername === username) {
    return cachedProvider;
  }

  // Check for Local Filesystem Mode
  if (process.env.USE_LOCAL_FS === 'true') {
    const localPath = process.env.LOCAL_CONTENT_DIR || 'test';
    console.log(`[DataProvider] Using LocalFsDataProvider: ${localPath}`);
    cachedProvider = new LocalFsDataProvider({
      contentDir: localPath,
      authorName: username,
      sourceUrl: `file://${localPath}`,
    });
    cachedUsername = username;
    return cachedProvider;
  }

  // Default to GitHub Mode
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required for GitHub mode');
  }

  console.log(`[DataProvider] Using GitHubDataProvider: ${username}/${FIXED_REPO_NAME}`);
  cachedProvider = new GitHubDataProvider({
    username,
    repo: FIXED_REPO_NAME,
    token,
  });
  cachedUsername = username;
  return cachedProvider;
}

export function clearProviderCache(): void {
  cachedProvider = null;
  cachedUsername = null;
}
