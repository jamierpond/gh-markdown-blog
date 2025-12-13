import type {
  Config,
  ArticleViewProps,
  FileBrowserViewProps,
  NoRepoFoundViewProps,
  LandingViewProps,
  FileInfo,
} from 'madea-blog-core';
import { GitHubDataProvider } from 'madea-blog-core/providers/github';
import Link from 'next/link';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const USERNAME = 'jamierpond';
const REPO = 'golf.blog';

// ============================================
// GOLF-THEMED VIEWS
// ============================================

function ArticleView({ article, username, branch }: ArticleViewProps) {
  const { content, commitInfo, title, path } = article;
  const sourceUrl = `https://github.com/${username}/${REPO}/blob/${branch}/${path}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f0a] to-[#052e16] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to articles
        </Link>

        <article>
          <header className="mb-8 pb-8 border-b border-green-900">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-green-400">
              <span>
                {new Date(commitInfo.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-green-700">•</span>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors underline"
              >
                View source
              </a>
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </Markdown>
          </div>
        </article>

        <footer className="mt-16 pt-8 border-t border-green-900 text-center text-green-600 text-sm">
          ⛳ Golf Blog
        </footer>
      </div>
    </div>
  );
}

function FileBrowserView({ articles, sourceInfo }: FileBrowserViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f0a] to-[#052e16]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          {sourceInfo.avatarUrl && (
            <div className="mb-6">
              <img
                src={sourceInfo.avatarUrl}
                alt={sourceInfo.name}
                className="w-24 h-24 rounded-full mx-auto border-4 border-green-500 shadow-lg shadow-green-500/20"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {sourceInfo.name}
          </h1>
          {sourceInfo.bio && (
            <p className="text-xl text-green-400 max-w-lg mx-auto">
              {sourceInfo.bio}
            </p>
          )}
          <div className="mt-6 text-3xl">
            ⛳ 🏌️ 🏆
          </div>
        </header>

        {/* Article list */}
        <div className="space-y-4">
          {articles.map((article: FileInfo) => (
            <Link
              key={article.sha}
              href={`/${article.path}`}
              className="block group"
            >
              <div className="p-6 rounded-lg bg-green-900/30 border border-green-800 hover:border-green-500 hover:bg-green-900/50 transition-all duration-300">
                <h2 className="text-xl md:text-2xl font-semibold text-white group-hover:text-green-400 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-green-500">
                  {new Date(article.commitInfo.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-green-600 text-sm">
          Powered by madea-blog-core
        </footer>
      </div>
    </div>
  );
}

function NoRepoFoundView({ username }: NoRepoFoundViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f0a] to-[#052e16] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-6">⛳</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Course Not Found
        </h1>
        <p className="text-green-400">
          Could not find {username}/{REPO}
        </p>
      </div>
    </div>
  );
}

function LandingView(_props: LandingViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f0a] to-[#052e16] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">⛳</div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Golf Blog
        </h1>
        <p className="text-xl text-green-400">
          Welcome to the green
        </p>
      </div>
    </div>
  );
}

// ============================================
// Config
// ============================================

export function createBlogConfig(): Config {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  if (!token) {
    throw new Error('GITHUB_TOKEN or GITHUB_PAT required');
  }

  const dataProvider = new GitHubDataProvider({
    username: USERNAME,
    repo: REPO,
    token,
  });

  return {
    dataProvider,
    username: USERNAME,
    fileBrowserView: FileBrowserView,
    articleView: ArticleView,
    noRepoFoundView: NoRepoFoundView,
    landingView: LandingView,
  };
}
