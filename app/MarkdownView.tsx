import Markdown from "react-markdown";
import { REPO, BRANCH } from "@/app/shared";

export function View({ data }: { data: any }) {
  const { content, encoding } = data;
  const filePath = data.path;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");
  const fileRemoteUrl = `https://github.com/${REPO}/blob/${BRANCH}/${filePath}`;

  return (
    <div className="flex flex-col gap-6 px-6 py-10 max-w-5xl mx-auto">
      <h2 className="text-3xl text-blue-600 dark:text-blue-400 font-bold border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <a
          href={fileRemoteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {filePath}
        </a>
      </h2>

      <article className="w-full bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">
        <Markdown
          components={{
            // Headings with proper spacing and hierarchy
            h1: ({ children }) => (
              <h1 className="text-3xl font-extrabold mt-10 mb-6 text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-8 mb-4 text-neutral-800 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-6 mb-3 text-neutral-800 dark:text-neutral-100">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-medium mt-5 mb-2 text-neutral-700 dark:text-neutral-200">
                {children}
              </h4>
            ),

            // Paragraphs with good readability
            p: ({ children }) => (
              <p className="my-4 text-neutral-700 dark:text-neutral-300 leading-7 text-base">
                {children}
              </p>
            ),

            // Links with nice hover effects
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-400/30 decoration-1 underline-offset-2 hover:decoration-2 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),

            // Inline code and code blocks
            code: ({ className, children }) => {
              // Inline code
              if (!className) {
                return (
                  <code className="bg-neutral-100 dark:bg-neutral-800 text-pink-600 dark:text-pink-400 rounded px-1.5 py-0.5 font-mono text-[0.9em]">
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

            // Code blocks with beautiful styling
            pre: ({ children }) => (
              <pre className="bg-neutral-50 dark:bg-neutral-950 rounded-lg p-4 my-6 overflow-x-auto font-mono text-sm border border-neutral-200 dark:border-neutral-800 shadow-md">
                {children}
              </pre>
            ),

            // Blockquotes with nice styling
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 pl-4 py-2 pr-2 my-6 text-neutral-700 dark:text-neutral-300 italic rounded-r">
                {children}
              </blockquote>
            ),

            // Lists with clear structure
            ul: ({ children }) => (
              <ul className="list-disc pl-6 my-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 my-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-6">{children}</li>
            ),

            // Images with responsive styling
            img: ({ src, alt }) => (
              <div className="flex justify-center my-8">
                <img
                  src={src}
                  alt={alt || ''}
                  className="max-w-full h-auto rounded-lg shadow-md border border-neutral-200 dark:border-neutral-800"
                />
              </div>
            ),

            // Tables with clean design
            table: ({ children }) => (
              <div className="overflow-x-auto my-8 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-neutral-50 dark:bg-neutral-900">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950/50">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                {children}
              </td>
            ),

            // Horizontal rule
            hr: () => (
              <hr className="my-10 border-t border-neutral-200 dark:border-neutral-800" />
            ),

            // Text formatting
            strong: ({ children }) => (
              <strong className="font-bold text-neutral-900 dark:text-neutral-100">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-neutral-800 dark:text-neutral-200">{children}</em>
            ),
          }}
        >
          {decodedContent}
        </Markdown>
      </article>
    </div>
  );
}

