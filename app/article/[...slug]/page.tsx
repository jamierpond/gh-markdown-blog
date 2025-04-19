// curl -s -H "Accept: application/vnd.github.v3+json" \
//   https://api.github.com/repos/vercel/next.js/contents/packages/next/README.md

import { REPO, BRANCH, GITHUB_TOKEN } from "@/app/shared";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

async function getData(file: string) {
  console.log("Fetching data for file:", file);
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${file}?ref=${BRANCH}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch data", res.status, res.statusText);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}


function View({ data }: { data: any }) {
  const { content, encoding } = data;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");

  return (
    <div className="flex flex-col gap-[16px] p-4 max-w-4xl mx-auto">
      <h2 className="text-[28px] font-bold border-b pb-2">{data.path}</h2>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
            code: ({ node, className, children, ...props }) => (
              <code className={`${className} bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5`} {...props}>
                {children}
              </code>
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4" {...props} />
            ),
            ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
            li: ({ node, ...props }) => <li className="my-1" {...props} />,
            img: ({ node, ...props }) => <img className="max-w-full rounded-md my-4" {...props} />
          }}
        >
          {decodedContent}
        </Markdown>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  console.log("Page params:", params);
  const file = params.slug.join("/");
  try {
    const data = await getData(file);
    console.log("Data fetched:", data);
    return <View data={data} />;
  } catch (error) {
    console.error("Failed to load", error);
    // todo make this return a page or redirect
    throw new Error("Failed to load");
  }
}
