import { AlertIcon } from "@/app/icons/svg";
import Link from "next/link";
import { headers } from "next/headers";
import { cache } from 'react';

// Re-export types and utilities from core
export type { CommitInfo, FileInfo, SourceInfo, DataProvider } from 'madea-blog-core';
export { extractTitle, extractDescription } from 'madea-blog-core';

export const FIXED_REPO_NAME = "madea.blog";

// Helper function to get username from request headers (set by middleware)
export async function getUsername(): Promise<string> {
  const headersList = await headers();
  const username = headersList.get('x-github-username') || '';
  return username;
}

// Helper function to build the full repo path: username/madea.blog
export async function getRepoPath(username?: string): Promise<string> {
  const user = username || await getUsername();
  if (!user) {
    throw new Error("No GitHub username found in subdomain");
  }
  return `${user}/${FIXED_REPO_NAME}`;
}

// Cached GitHub user fetch for metadata generation
export const getGithubUser = cache(async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
});

export function ArticleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
        <AlertIcon />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Sorry, we couldn&apos;t find the article you&apos;re looking for.</p>
        <Link href="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
