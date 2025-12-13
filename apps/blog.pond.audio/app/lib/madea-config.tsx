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
const REPO = 'madea.blog';

// ============================================
// View Components
// ============================================

function ArticleView({ article, username, branch }: ArticleViewProps) {
  const { content, commitInfo, title, path } = article;
  const sourceUrl = `https://github.com/${username}/${REPO}/blob/${branch}/${path}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <header className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              {new Date(commitInfo.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              View source
            </a>
          </div>
        </header>

        <div className="px-8 py-6 prose prose-gray max-w-none">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content}
          </Markdown>
        </div>
      </article>
    </div>
  );
}

function FileBrowserView({ articles, sourceInfo }: FileBrowserViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        {sourceInfo.avatarUrl && (
          <img
            src={sourceInfo.avatarUrl}
            alt={sourceInfo.name}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{sourceInfo.name}</h1>
        {sourceInfo.bio && (
          <p className="text-gray-600">{sourceInfo.bio}</p>
        )}
      </header>

      <div className="space-y-4">
        {articles.map((article: FileInfo) => (
          <Link
            key={article.sha}
            href={`/${article.path}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(article.commitInfo.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NoRepoFoundView({ username }: NoRepoFoundViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">No blog found</h1>
      <p className="text-gray-600">
        Could not find repository {username}/{REPO}
      </p>
    </div>
  );
}

function LandingView(_props: LandingViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
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
