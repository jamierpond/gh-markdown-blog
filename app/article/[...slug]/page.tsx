import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getFileContent, getLastUpdated, getUsername } from "@/app/shared";

export default async function Page({ params }: PageProps) {
  const username = await getUsername();

  if (!params || !username) {
    return <ArticleNotFound />;
  }

  const p = await params;
  const slug = p.slug as string[];
  if (!slug) {
    return <div>Invalid slug</div>;
  }
  const file = slug.join("/");

  try {
    const content = await getFileContent(file, username);
    const lastUpdated = await getLastUpdated(username, file);
    return <MarkdownView content={content} path={file} username={username} lastUpdated={lastUpdated} />;
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
