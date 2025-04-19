import { PageProps } from "@/.next/types/app/layout";
import { REPO, BRANCH, getFromGithub } from "@/app/shared";
import Link from "next/link";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { AlertIcon } from "@/app/icons/svg";

async function getData(file: string) {
  console.log("Fetching data for file:", file);
  const url = `https://api.github.com/repos/${REPO}/contents/${file}?ref=${BRANCH}`;
  return await getFromGithub(url);
}

function ArticleNotFound() {
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

export default async function Page({ params }: PageProps) {
  if (!params) {
    return <div>Invalid parameters</div>;
  }
  const p = await params;
  const slug = p.slug as string[];
  if (!slug) {
    return <div>Invalid slug</div>;
  }
  const file = slug.join("/");

  try {
    const data = await getData(file);
    console.log("Data fetched:", data);
    return <MarkdownView data={data} />;
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
