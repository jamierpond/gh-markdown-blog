import type { DataProvider } from 'madea-blog-core';
import { GitHubDataProvider } from 'madea-blog-core/providers/github';
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

export const FIXED_REPO_NAME = 'madea.blog';

// Create a new provider instance for each request
// Don't cache across requests as different users will have different usernames
export function getDataProvider(username: string): DataProvider {
  // Check for Local Filesystem Mode
  if (process.env.USE_LOCAL_FS === 'true') {
    const localPath = process.env.LOCAL_CONTENT_DIR || 'test';
    console.log(`[DataProvider] Using LocalFsDataProvider: ${localPath}`);
    return new LocalFsDataProvider({
      contentDir: localPath,
      authorName: username,
      sourceUrl: `file://${localPath}`,
    });
  }

  // Default to GitHub Mode
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  if (!token) {
    throw new Error('GITHUB_TOKEN or GITHUB_PAT environment variable is required for GitHub mode');
  }

  console.log(`[DataProvider] Using GitHubDataProvider: ${username}/${FIXED_REPO_NAME}`);
  return new GitHubDataProvider({
    username,
    repo: FIXED_REPO_NAME,
    token,
  });
}
