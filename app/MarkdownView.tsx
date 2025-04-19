import Markdown from "react-markdown";
import { REPO, BRANCH } from "@/app/shared";

export function View({ data }: { data: any }) {
  const { content, encoding } = data;
  const filePath = data.path;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");
  const fileRemoteUrl = `https://github.com/${REPO}/blob/${BRANCH}/${filePath}`;
  return (
    <div className="flex flex-col gap-[16px] p-6 max-w-4xl mx-auto">


        <h2 className="text-[28px] text-blue font-bold border-b pb-2 mb-4">
          <a href={fileRemoteUrl} target="_blank" rel="noopener noreferrer">
            {filePath}
          </a>
        </h2>

      <article className="w-full">
        <Markdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 border-b pb-1">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
            h4: ({ children }) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
            p: ({ children }) => <p className="my-4 text-base leading-relaxed">{children}</p>,
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-400 decoration-1 underline-offset-2 hover:decoration-2"
              >
                {children}
              </a>
            ),
            code: ({ className, children }) => {
              // Inline code
              if (!className) {
                return (
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-1.5 py-0.5 font-mono text-sm">
                    {children}
                  </code>
                );
              }
              // Code block with language
              return (
                <code className={`${className} block`}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 my-4 overflow-x-auto font-mono text-sm border border-gray-200 dark:border-gray-700">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>,
            li: ({ children }) => <li className="my-1">{children}</li>,
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || ''}
                className="max-w-full h-auto rounded-md my-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 border border-gray-300 dark:border-gray-700">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                {children}
              </td>
            ),
            hr: () => <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />
          }}
        >
          {decodedContent}
        </Markdown>
      </article>
    </div>
  );
}

