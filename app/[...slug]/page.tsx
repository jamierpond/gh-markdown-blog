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
  // userrepo is first two elements of slug

  const repo = `${slug[0]}/${slug[1]}`;
  const branch = slug[2];
  console.log("Repo:", repo);
  console.log("Branch:", branch);

  if (slug.length == 3) {
    // return the browser page
    return <FileBrowser repo={repo} branch={branch} />; // Pass the repo and branch to FileBrowser
  }

  if (!slug) {
    return <div>Invalid slug</div>;
  }

  // pop the first three
  slug.splice(0, 3);
  const file = slug.join("/");
  console.warn("File:", file);

  try {
    const data = await getPageData(file, repo, branch);
    console.log("Data fetched:", data);
    return <MarkdownView data={data} />;
  } catch (error) {
    console.error("Failed to load", error);
    return <ArticleNotFound />;
  }
}
