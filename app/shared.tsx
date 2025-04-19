export const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
import { AlertIcon } from "@/app/icons/svg";
import Link from "next/link";

export async function getFromGithub(url: string) {
  const res = await fetch(
    url,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from GitHub");
  }

  const data = await res.json();
  return data;
}

export async function getPageData(file: string, repo: string, branch: string) {
  console.log("Fetching data for file:", file);
  const url = `https://api.github.com/repos/${repo}/contents/${file}?ref=${branch}`;
  console.log("Fetching from URL:", url);
  return await getFromGithub(url);
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

