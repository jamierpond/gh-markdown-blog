import { PageProps } from "@/.next/types/app/layout";
import { MarkdownView } from "@/app/Components/MarkdownView";
import { ArticleNotFound, getPageData } from "@/app/shared";
import FileBrowser from "@/app/Components/FileBrowser";

export default async function Page({ params }: PageProps) {
  if (!params) {
    return <div>Invalid parameters</div>;
  }

  const p = await params;
  const slug = p.slug as string[];
  const repo = `${slug[0]}/${slug[1]}`;

  if (!slug) {
    return <div>Invalid slug</div>;
  }

  // user/reponame
  const LEN_DEFAULT = 2;
  if (slug.length == 2) {
    return <FileBrowser repo={repo} />; // Pass the repo and branch to FileBrowser
  }

  slug.splice(0, LEN_DEFAULT);
  const file = slug.join("/");

  try {
    const data = await getPageData(file, repo);
    return <MarkdownView data={data} repo={repo} />; // Pass the repo and branch to MarkdownView
  } catch (error) {
    return <ArticleNotFound />;
  }
}
