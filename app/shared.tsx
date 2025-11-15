export const DEFAULT_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const DEFAULT_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export const FIXED_REPO_NAME = "madea.blog"; // Special fixed repository name
import assert from "assert";

import { AlertIcon } from "@/app/icons/svg";
import Link from "next/link";
import { headers } from "next/headers";

const TEN_MINUTES_SECONDS = 60 * 10;
const ONE_DAY_SECONDS = 60 * 60 * 24;

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

export async function getFromGithub(url: string, cacheSeconds: number = TEN_MINUTES_SECONDS) {
  assert(GITHUB_TOKEN, "you must provide a GITHUB_TOKEN in your environment variables");
  const res = await fetch(
    url,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      cache: 'force-cache',
      next: { revalidate: cacheSeconds },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from GitHub");
  }

  const data = await res.json();
  return data;
}

export async function getPageData(file: string, username: string) {
  const repo = await getRepoPath(username);
  const branch = await getDefaultBranch(username);
  const url = `https://api.github.com/repos/${repo}/contents/${file}?ref=${branch}`;
  console.log("Fetching from URL:", url);
  const data = await getFromGithub(url, TEN_MINUTES_SECONDS);
  return data;
}


export async function getFileContent(file: string, username: string) {
  const data = await getPageData(file, username);
  const { content, encoding } = data;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");
  return decodedContent;
}

// Extract a descriptive summary from markdown content
export function extractDescription(content: string): string {
  const contentWithoutTitle = content.replace(/^#[^\n]*\n/, '');
  const firstParagraph = contentWithoutTitle.split('\n\n').find(p => p.trim() && !p.startsWith('#')) || '';
  let description = firstParagraph.slice(0, 300).trim();

  // If description is too short, try to get more content
  if (description.length < 100) {
    const secondParagraph = contentWithoutTitle.split('\n\n').filter(p => p.trim() && !p.startsWith('#'))[1] || '';
    description = (firstParagraph + ' ' + secondParagraph).slice(0, 300).trim();
  }

  // Truncate at sentence boundary if possible, aim for ~155 chars
  if (description.length > 155) {
    const sentenceEnd = description.slice(0, 155).lastIndexOf('.');
    if (sentenceEnd > 100) {
      description = description.slice(0, sentenceEnd + 1);
    } else {
      description = description.slice(0, 155) + '...';
    }
  }
  return description;
}

// Extract title from markdown content if first line starts with "# "
// Falls back to formatted filename if no title found
export function extractTitle(content: string, filepath: string): string {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();

  if (firstLine && firstLine.startsWith('# ')) {
    // Remove the "# " prefix and return the title
    return firstLine.substring(2).trim();
  }

  // Fallback: format the filename
  return filepath
    .replace(/\.(md|mdx)$/, '')
    .replace(/[-_]/g, ' ')
    .split('/')
    .pop() || filepath;
}


export async function getDefaultBranch(username: string) {
  const repo = await getRepoPath(username);
  const data = await getFromGithub(`https://api.github.com/repos/${repo}`, ONE_DAY_SECONDS);
  return data.default_branch;
}


export async function getLastUpdated(username: string, file: string) {
  const repo = await getRepoPath(username);
  const commits = await getFromGithub(`https://api.github.com/repos/${repo}/commits?path=${file}&per_page=1`);
  if (!commits || commits.length === 0) {
    throw new Error("No commits found for this file");
  }
  const lastCommit = commits[0];
  const lastUpdated = lastCommit.commit.author.date;
  return lastUpdated;
}


import { cache } from 'react';

export const getGithubUser = cache(async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
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

