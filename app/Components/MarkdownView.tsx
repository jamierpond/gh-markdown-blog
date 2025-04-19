import Link from "next/link";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export interface GithubResponse {
  content: string;
  encoding: BufferEncoding;
  path: string;
}

function View({ content, path, lastUpdated }: { path: string, content: string, lastUpdated: string }) {
  return (
    <div className="flex flex-col gap-[24px] p-6 sm:p-8 max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-[36px] font-bold text-gray-900 dark:text-white">{path}</h2>
        <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm">Markdown Article</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm">Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
        </div>
      </header>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ ...props }) => <h1 className="text-[32px] font-bold mt-10 mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2" {...props} />,
            h2: ({ ...props }) => <h2 className="text-[28px] font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100" {...props} />,
            h3: ({ ...props }) => <h3 className="text-[24px] font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200" {...props} />,
            h4: ({ ...props }) => <h4 className="text-[20px] font-medium mt-5 mb-2 text-gray-700 dark:text-gray-300" {...props} />,

            p: ({ ...props }) => <p className="text-[18px] my-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,

            a: ({ ...props }) => <a className="text-blue-500 hover:underline transition-colors duration-200" {...props} />,

            code: ({ className, children, ...props }) => (
              <code className={`${className} bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded px-1.5 py-0.5 font-mono text-[0.9em]`} {...props}>
                {children}
              </code>
            ),

            pre: ({ ...props }) => (
              <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 my-6 overflow-x-auto font-mono text-sm border border-gray-200 dark:border-gray-700 shadow-sm" {...props} />
            ),

            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 pl-5 py-2 pr-3 my-6 text-gray-700 dark:text-gray-300 italic rounded-r" {...props} />
            ),

            ul: ({ ...props }) => <ul className="list-disc pl-8 my-5 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
            ol: ({ ...props }) => <ol className="list-decimal pl-8 my-5 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
            li: ({ ...props }) => <li className="text-[18px] leading-relaxed" {...props} />,

            img: ({ ...props }) => (
              <div className="flex justify-center my-8">
                <img className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700" {...props} />
              </div>
            ),

            table: ({ ...props }) => (
              <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
              </div>
            ),
            thead: ({ ...props }) => <thead className="bg-gray-50 dark:bg-gray-900" {...props} />,
            tbody: ({ ...props }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800" {...props} />,
            tr: ({ ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" {...props} />,
            th: ({ ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />,
            td: ({ ...props }) => <td className="px-6 py-4 text-[16px] text-gray-700 dark:text-gray-300" {...props} />,

            hr: ({ ...props }) => <hr className="my-10 border-t border-gray-200 dark:border-gray-700" {...props} />,

            strong: ({ ...props }) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
            em: ({ ...props }) => <em className="italic text-gray-800 dark:text-gray-200" {...props} />,

            sup: ({ ...props }) => <sup className="text-sm text-blue-500 font-bold align-super" {...props} />,
            section: ({ className, ...props }) => {
              if (className === "footnotes") {
                return (
                  <section className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700" {...props}>
                    {props.children}
                  </section>
                );
              }
              return <section className={className} {...props} />;
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
}

export function MarkdownView({ content, repo, path, lastUpdated }: { content: string, path: string, repo: string, lastUpdated: string }) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Link
              href={`/${repo}`}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
          <View content={content} path={path} lastUpdated={lastUpdated} />
        </div>
      </div>
    );
}

