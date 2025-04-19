import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";
import { REPO, BRANCH } from "@/app/shared";

export function View({ data }: { data: any }) {
  const { content, encoding } = data;
  const filePath = data.path;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");
  const fileRemoteUrl = `https://github.com/${REPO}/blob/${BRANCH}/${filePath}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400 inline-flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {filePath}
          </span>
          <a
            href={fileRemoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on GitHub
          </a>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <Markdown
            remarkPlugins={[remarkGfm, [remarkFootnotes, { inlineNotes: true }]]}
            components={{
              // Headings with proper spacing and hierarchy
              h1: ({ children }) => (
                <h1 className="text-3xl font-extrabold mt-10 mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-100">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-medium mt-5 mb-2 text-slate-700 dark:text-slate-200">
                  {children}
                </h4>
              ),

              // Paragraphs with good readability
              p: ({ children }) => (
                <p className="my-4 text-slate-700 dark:text-slate-300 leading-7 text-base">
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
                    <code className="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 rounded px-1.5 py-0.5 font-mono text-[0.9em]">
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
                <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 my-6 overflow-x-auto font-mono text-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                  {children}
                </pre>
              ),

              // Blockquotes with nice styling
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 pl-4 py-2 pr-2 my-6 text-slate-700 dark:text-slate-300 italic rounded-r">
                  {children}
                </blockquote>
              ),

              // Lists with clear structure
              ul: ({ children }) => (
                <ul className="list-disc pl-6 my-5 space-y-2 text-slate-700 dark:text-slate-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 my-5 space-y-2 text-slate-700 dark:text-slate-300">
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
                    className="max-w-full h-auto rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
                  />
                </div>
              ),

              // Tables with clean design
              table: ({ children }) => (
                <div className="overflow-x-auto my-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-50 dark:bg-slate-900">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {children}
                </td>
              ),

              // Horizontal rule
              hr: () => (
                <hr className="my-10 border-t border-slate-200 dark:border-slate-700" />
              ),

              // Text formatting
              strong: ({ children }) => (
                <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-slate-800 dark:text-slate-200">{children}</em>
              ),

              // Footnotes support
              sup: ({ children }) => (
                <sup className="text-sm text-blue-600 dark:text-blue-400 font-medium align-super">
                  {children}
                </sup>
              ),
              section: ({ className, children }) => {
                if (className === "footnotes") {
                  return (
                    <section className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Footnotes</h2>
                      {children}
                    </section>
                  );
                }
                return <section className={className}>{children}</section>;
              },
              'section.footnotes ol': ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {children}
                </ol>
              ),
              'section.footnotes li': ({ children, id }) => (
                <li id={id} className="text-sm leading-6 mb-2">
                  {children}
                </li>
              ),
              'section.footnotes li a:last-child': ({ href, children }) => (
                <a
                  href={href}
                  className="ml-1 text-blue-500 dark:text-blue-400 no-underline"
                  aria-label="Back to content"
                >
                  ↩
                </a>
              ),
            }}
          >
            {decodedContent}
          </Markdown>
        </article>
      </div>
    </div>
  );
}