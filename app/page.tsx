import { REPO, BRANCH, GITHUB_TOKEN } from "@/app/shared";

export default async function Home() {
  const files = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer: ${GITHUB_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  const tree = files.tree;
  if (!tree) {
    return (
      <>
        <div>Failed to tree!</div>
        <div>Got: {JSON.stringify(files)}</div>
      </>
    );
  }

  const markdownFiles = files.tree.filter(
    (file: any) => file.path.endsWith(".md") || file.path.endsWith(".mdx")
  );

  if (!files) {
    return <div>Failed to load</div>;
  }

  function ArticleCard({ file }: { file: any }) {
    return (
      <div className="flex flex-col gap-[16px]">
        <h2 className="text-[24px] font-bold">{file.path}</h2>
        <a href={`/article/${file.path}`} className="text-[16px] text-blue-500 hover:underline">
          <p>Read more</p>
        </a>
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-[16px]">
          <h1 className="text-[48px] font-bold">Primer</h1>
          <p className="text-[24px]">A collection of design tokens and components.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[32px]">
          {markdownFiles.map((file: any) => (
            <ArticleCard key={file.path} file={file} />
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </>
  );
}
