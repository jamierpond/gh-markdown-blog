import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getFileContent, getPageData } from "@/app/shared";
import FileBrowser from "@/app/Components/FileBrowser";
import { Metadata } from "next";

async function parseParams(params: Promise<any>) {
  const p = await params;
  const slug = p.slug as string[];
  const repo = `${slug[0]}/${slug[1]}`;
  const file = slug.slice(2).join("/");
  return { repo, file };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!params) {
    return {
      title: "Blogify your GitHub Repo",
      description: "Blogify your GitHub Repo",
    };
  }

  const { repo, file } = await parseParams(params);
  const data = await getPageData(file, repo);

  return {
    title: `${repo} - ${file || "Blog"}`,
    description: `${repo} - ${file || "Blog"}`,
  };
}

export default async function Page({ params }: PageProps) {
  if (!params) {
    return <ArticleNotFound />;
  }
  const { repo, file } = await parseParams(params);

  console.log("Parsed params:", repo, file);
  if (!file) {
    console.log("Going to file browser");
    return <FileBrowser repo={repo} />; // Pass the repo and branch to FileBrowser
  }

  console.log("Going to file", file);

  try {
    const content = await getFileContent(file, repo);
    return <MarkdownView content={content} repo={repo} />; // Pass the repo and branch to MarkdownView
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
