import type { FileInfo, SourceInfo } from 'madea-blog-core';
import PageLayout from "./PageLayout";
import Link from 'next/link';
import Image from 'next/image';

interface FileBrowserProps {
  articles: FileInfo[];
  sourceInfo: SourceInfo;
  username: string;
}

function NoRepoFound({ username }: { username: string }) {
  return (
    <PageLayout>
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="text-7xl mb-6">📝</div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-6 leading-tight">
            {username} hasn&apos;t made a madea.blog yet!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            You can get started by pushing markdown to
          </p>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8">
          <code className="text-purple-600 dark:text-purple-400 font-mono text-lg block mb-6">
            {username}/madea.blog
          </code>
          <a
            href={`https://github.com/${username}/madea.blog`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Create on GitHub
          </a>
        </div>
      </div>
    </PageLayout>
  );
}

export { NoRepoFound };

export default function FileBrowser({ articles, sourceInfo, username }: FileBrowserProps) {
  if (!articles.length) {
    return <div className="flex items-center justify-center min-h-screen">No articles found</div>;
  }

  return (
    <PageLayout>
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Profile Picture */}
          {sourceInfo.avatarUrl && (
            <div className="mb-6 flex justify-center">
              <Link href={sourceInfo.sourceUrl} className="group">
                <Image
                  src={sourceInfo.avatarUrl}
                  alt={sourceInfo.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500 dark:group-hover:border-purple-400 shadow-lg"
                  priority
                />
              </Link>
            </div>
          )}

          <Link href={sourceInfo.sourceUrl} className="group inline-block">
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-4 transition-all duration-300 group-hover:scale-105">
              {sourceInfo.name}
            </h1>
          </Link>

          {sourceInfo.bio && (
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
              {sourceInfo.bio}
            </p>
          )}

          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
            Hosted with love on<a href="https://madea.blog" target="_blank" rel="noopener noreferrer" className="ml-1 text-purple-600 dark:text-purple-400 font-medium underline hover:no-underline">madea.blog</a>
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: FileInfo) => (
            <Link
              key={article.sha}
              href={`/${article.path}`}
              className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 hover:border-gray-300 dark:hover:border-gray-700"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>

              <div className="relative p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 transition-all duration-300">
                  {article.title}
                </h2>

                {/* Commit author info with avatar and last updated */}
                <div className="flex items-center gap-3 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.commitInfo.authorAvatarUrl || `https://github.com/${article.commitInfo.authorUsername || username}.png`}
                    alt={article.commitInfo.authorName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Updated by{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {article.commitInfo.authorName}
                    </span>
                    {' '}on {new Date(article.commitInfo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Read more indicator */}
                <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  <span>Read article</span>
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-24 pb-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} {sourceInfo.name}
        </p>
      </footer>
    </PageLayout>
  );
}
