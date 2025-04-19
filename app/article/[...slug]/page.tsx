import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getPageData } from "@/app/shared";
import { REPO, BRANCH } from "@/app/shared";

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
    if (!REPO || !BRANCH) {
      throw new Error("Repository or branch not specified");
    }
    const data = await getPageData(file, REPO);
    console.log("Data fetched:", data);
    return <MarkdownView data={data} repo={REPO} />; // Pass the repo and branch to MarkdownView
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
