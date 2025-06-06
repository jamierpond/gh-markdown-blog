import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getFileContent, getLastUpdated } from "@/app/shared";
import FileBrowser from "@/app/Components/FileBrowser";
import { Metadata } from "next";

interface Params {
  // tied to name of the folder in the file system
  slug: string[];
}

async function parseParams(params: Promise<Params>) {
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
  if (!file) {
    return {
      title: `${repo} - Blog`,
      description: "Blogify your GitHub Repo",
    };
  }

  const content = await getFileContent(file, repo);
  const first160Chars = content.slice(0, 160);
  return {
    title: `${repo} - ${file || "Blog"}`,
    description: `${first160Chars}...`,
    openGraph: {
      title: `${repo} - ${file || "Blog"}`,
      description: `${first160Chars}...`,
      images: ["https://pond.audio/pup.jpg"],
    },
    twitter: {
      title: `${repo} - ${file || "Blog"}`,
      description: `${first160Chars}...`,
      card: "summary",
      images: ["https://pond.audio/pup.jpg"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  if (!params) {
    return <ArticleNotFound />;
  }
  const { repo, file } = await parseParams(params);

  if (!file) {
    return <FileBrowser repo={repo} />; // Pass the repo and branch to FileBrowser
  }

  try {
    const content = await getFileContent(file, repo);
    const lastUpdated = await getLastUpdated(repo, file);
    return <MarkdownView content={content} repo={repo} path={file} lastUpdated={lastUpdated} />; // Pass the repo and branch to MarkdownView
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
