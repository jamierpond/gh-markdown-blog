import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getFileContent, getLastUpdated, getUsername, extractTitle } from "@/app/shared";

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
    const title = extractTitle(content, file);
    return <MarkdownView content={content} path={file} lastUpdated={lastUpdated} title={title} />;
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
