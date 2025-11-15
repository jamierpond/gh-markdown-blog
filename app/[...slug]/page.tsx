import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getFileContent, getLastUpdated, getUsername, extractTitle } from "@/app/shared";
import FileBrowser from "@/app/Components/FileBrowser";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface Params {
  // tied to name of the folder in the file system
  slug: string[];
}

async function parseParams(params: Promise<Params>) {
  const p = await params;
  const slug = p.slug as string[];
  // Now slug only represents the file path (no repo info)
  const file = slug.join("/");
  return { file };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const username = await getUsername();

  if (!params || !username) {
    return {
      title: "Blogify your GitHub Repo",
      description: "Blogify your GitHub Repo",
    };
  }

  const { file } = await parseParams(params);

  if (!file) {
    return {
      title: `${username}'s Blog`,
      description: "Blogify your GitHub Repo",
    };
  }

  const content = await getFileContent(file, username);
  const title = extractTitle(content, file);
  const first160Chars = content.slice(0, 160);
  return {
    title: `${title} - ${username}`,
    description: `${first160Chars}...`,
    openGraph: {
      title: `${title} - ${username}`,
      description: `${first160Chars}...`,
      images: ["https://pond.audio/pup.jpg"],
    },
    twitter: {
      title: `${title} - ${username}`,
      description: `${first160Chars}...`,
      card: "summary",
      images: ["https://pond.audio/pup.jpg"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const username = await getUsername();

  if (!params || !username) {
    return <ArticleNotFound />;
  }

  const { file } = await parseParams(params);

  if (!file) {
    return <FileBrowser username={username} />;
  }

  try {
    const content = await getFileContent(file, username);
    const lastUpdated = await getLastUpdated(username, file);
    const title = extractTitle(content, file);
    return <MarkdownView content={content} path={file} lastUpdated={lastUpdated} title={title} />;
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
