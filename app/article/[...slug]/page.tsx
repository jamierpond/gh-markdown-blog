import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getFileContent, getLastUpdated } from "@/app/shared";
import { DEFAULT_REPO, DEFAULT_BRANCH } from "@/app/shared";

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
    if (!DEFAULT_REPO || !DEFAULT_BRANCH) {
      throw new Error("Repository or branch not specified");
    }
    const content = await getFileContent(file, DEFAULT_REPO);
    const lastUpdated = await getLastUpdated(DEFAULT_REPO, file);
    return <MarkdownView content={content} path={file} repo={DEFAULT_REPO} lastUpdated={lastUpdated} />; // Pass the repo and branch to MarkdownView
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
