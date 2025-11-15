import Link from "next/link";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import PageLayout from "./PageLayout";
import { extractDescription, getGithubUser, getDefaultBranch } from "@/app/shared";

export interface GithubResponse {
  content: string;
  encoding: BufferEncoding;
  path: string;
}

function View({ content, lastUpdated, title, username, authorName, path, branch }: { content: string, lastUpdated: string, title: string, username: string, authorName?: string, path: string, branch: string }) {
  const sourceUrl = `https://github.com/${username}/madea.blog/blob/${branch}/${path}`;

  return (
    <article className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl">
      <header className="px-8 sm:px-12 pt-12 pb-8 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://github.com/${username}.png`}
            alt={username}
            className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {authorName || username}
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-4 leading-tight">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>Updated {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View source
          </a>
        </div>
      </header>
      <div className="px-4 sm:px-12 py-8 prose prose-lg dark:prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-0 mb-6 text-gray-900 dark:text-white first:mt-0" {...props} />,
            h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white" {...props} />,
            h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white" {...props} />,
            h4: ({ ...props }) => <h4 className="text-lg font-medium mt-6 mb-2 text-gray-800 dark:text-gray-200" {...props} />,

            p: ({ ...props }) => <p className="text-lg my-5 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,

            a: ({ ...props }) => <a className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-2 transition-colors" {...props} />,

            code: ({ className, children, ...props }) => (
              <code className={`${className} bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded px-1.5 py-0.5 font-mono text-sm`} {...props}>
                {children}
              </code>
            ),

            pre: ({ ...props }) => (
              <pre className="bg-gray-900 dark:bg-black rounded-xl p-6 my-8 overflow-x-auto font-mono text-sm border border-gray-700 dark:border-gray-800 shadow-lg" {...props} />
            ),

            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-purple-500 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-900/10 pl-6 py-4 pr-4 my-8 text-gray-700 dark:text-gray-300 italic rounded-r-lg" {...props} />
            ),

            ul: ({ ...props }) => <ul className="list-disc pl-6 my-6 space-y-3 text-gray-700 dark:text-gray-300 marker:text-purple-500" {...props} />,
            ol: ({ ...props }) => <ol className="list-decimal pl-6 my-6 space-y-3 text-gray-700 dark:text-gray-300 marker:text-purple-500" {...props} />,
            li: ({ ...props }) => <li className="text-lg leading-relaxed" {...props} />,

            img: ({ ...props }) => (
              <div className="flex justify-center my-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="max-w-full h-auto rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800" {...props} alt="" />
              </div>
            ),

            table: ({ ...props }) => (
              <div className="overflow-x-auto my-10 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" {...props} />
              </div>
            ),
            thead: ({ ...props }) => <thead className="bg-gray-100 dark:bg-gray-900" {...props} />,
            tbody: ({ ...props }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950" {...props} />,
            tr: ({ ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors" {...props} />,
            th: ({ ...props }) => <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" {...props} />,
            td: ({ ...props }) => <td className="px-6 py-4 text-base text-gray-700 dark:text-gray-300" {...props} />,

            hr: ({ ...props }) => <hr className="my-12 border-t border-gray-300 dark:border-gray-700" {...props} />,

            strong: ({ ...props }) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
            em: ({ ...props }) => <em className="italic text-gray-800 dark:text-gray-200" {...props} />,

            sup: ({ ...props }) => <sup className="text-sm text-purple-600 dark:text-purple-400 font-bold align-super" {...props} />,
            section: ({ className, ...props }) => {
              if (className === "footnotes") {
                return (
                  <section className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700" {...props}>
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
    </article>
  );
}

export async function MarkdownView({ content, path, lastUpdated, title, username }: { content: string, path: string, lastUpdated: string, title?: string, username: string }) {

    // Get the default branch for source link
    const branch = await getDefaultBranch(username);

    // Calculate word count and reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

    const articleSummary = extractDescription(content);

    // Fetch author's real name and additional data from GitHub
        let authorName: string | undefined;
    let authorAvatar: string | undefined;
    let authorBio: string | undefined;

    const userData = await getGithubUser(username);
    if (userData) {
      authorName = userData.name;
      authorAvatar = `https://github.com/${username}.png`;
      authorBio = userData.bio;
    }

    const baseUrl = `https://${username}.madea.blog`;
    const articleUrl = `${baseUrl}/${path}`;

    // Generate enhanced JSON-LD structured data for SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: articleSummary,
      datePublished: lastUpdated,
      dateModified: lastUpdated,
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
      url: articleUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      author: {
        '@type': 'Person',
        name: authorName || username,
        url: `https://github.com/${username}`,
        ...(authorAvatar && { image: authorAvatar }),
        ...(authorBio && { description: authorBio }),
      },
      publisher: {
        '@type': 'Organization',
        name: authorName || username,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: authorAvatar || `https://github.com/${username}.png`,
        },
      },
      image: authorAvatar || `https://github.com/${username}.png`,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
    };

    return (
      <>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <PageLayout>
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Back</span>
            </Link>

            <View content={content} lastUpdated={lastUpdated} title={title as string} username={username} authorName={authorName} path={path} branch={branch} />
          </div>
        </PageLayout>
      </>
    );
}

