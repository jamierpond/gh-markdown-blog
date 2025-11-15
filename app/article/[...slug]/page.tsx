import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { getFileContent, getLastUpdated, getUsername, extractTitle } from "@/app/shared";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const username = await getUsername();

  if (!params || !username) {
    notFound();
  }

  const p = await params;
  const slug = p.slug as string[];
  if (!slug) {
    notFound();
  }
  const file = slug.join("/");

  try {
    const content = await getFileContent(file, username);
    const lastUpdated = await getLastUpdated(username, file);
    const title = extractTitle(content, file);
    return <MarkdownView content={content} path={file} lastUpdated={lastUpdated} title={title} username={username} />;
  } catch {
    notFound();
  }
}
