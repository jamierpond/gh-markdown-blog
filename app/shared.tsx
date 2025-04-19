export const DEFAULT_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const DEFAULT_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
import { AlertIcon } from "@/app/icons/svg";
import Link from "next/link";

const TEN_MINUTES_SECONDS = 60 * 10;
const ONE_DAY_SECONDS = 60 * 60 * 24;
export async function getFromGithub(url: string, cacheSeconds: number = TEN_MINUTES_SECONDS) {
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

export async function getPageData(file: string, repo: string) {
  const branch = await getDefaultBranch(repo);
  const url = `https://api.github.com/repos/${repo}/contents/${file}?ref=${branch}`;
  console.log("Fetching from URL:", url);
  const data = await getFromGithub(url, TEN_MINUTES_SECONDS);
  return data;
}


export async function getFileContent(file: string, repo: string) {
  const data = await getPageData(file, repo);
  const { content, encoding } = data;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");
  return decodedContent;
}


export async function getDefaultBranch(repo: string) {
  const data = await getFromGithub(`https://api.github.com/repos/${repo}`, ONE_DAY_SECONDS);
  return data.default_branch;
}


export async function getLastUpdated(repo: string, file: string) {
  const commits = await getFromGithub(`https://api.github.com/repos/${repo}/commits?path=${file}&per_page=1`);
  if (!commits || commits.length === 0) {
    throw new Error("No commits found for this file");
  }
  const lastCommit = commits[0];
  const lastUpdated = lastCommit.commit.author.date;
  return lastUpdated;
}


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

