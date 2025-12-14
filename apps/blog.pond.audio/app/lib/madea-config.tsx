import type {
  MadeaConfigWithSeo,
  ArticleViewProps,
  FileBrowserViewProps,
  NoRepoFoundViewProps,
  LandingViewProps,
  FileInfo,
} from 'madea-blog-core';
import { generateMetadataForIndex, generateMetadataForArticle } from 'madea-blog-core';
import { GitHubDataProvider } from 'madea-blog-core/providers/github';
import Link from 'next/link';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const USERNAME = 'jamierpond';
const REPO = 'madea.blog';

// ============================================
// FUNKY 90s DISCO VIEWS
// ============================================

function ArticleView({ article, username, branch }: ArticleViewProps) {
  const { content, commitInfo, title, path } = article;
  const sourceUrl = `https://github.com/${username}/${REPO}/blob/${branch}/${path}`;

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      {/* Disco ball effect */}
      <div className="fixed top-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-white via-gray-300 to-gray-500 animate-spin opacity-30" style={{ animationDuration: '10s' }} />

      <Link
        href="/"
        className="inline-block mb-8 px-6 py-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-black font-black uppercase tracking-widest text-sm rounded-none border-4 border-white hover:scale-110 transition-transform"
        style={{ fontFamily: 'Impact, sans-serif' }}
      >
        &lt;&lt; BACK 2 DA LIST
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8 p-8 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-400 border-8 border-yellow-300" style={{ transform: 'rotate(-1deg)' }}>
          <h1
            className="text-4xl md:text-6xl font-black text-white uppercase mb-4"
            style={{
              fontFamily: 'Impact, sans-serif',
              textShadow: '4px 4px 0 #000, -2px -2px 0 #ff00ff, 2px -2px 0 #00ffff'
            }}
          >
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-lg text-yellow-300 font-mono">
            <span className="bg-black px-3 py-1">
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
              className="bg-black px-3 py-1 hover:bg-yellow-300 hover:text-black transition-colors"
            >
              [VIEW SOURCE]
            </a>
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none p-8 bg-gradient-to-b from-purple-900 to-black border-4 border-dashed border-cyan-400"
          style={{ transform: 'rotate(0.5deg)' }}
        >
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content}
          </Markdown>
        </div>

        {/* Decorative stars */}
        <div className="text-center mt-8 text-6xl animate-pulse">
          ✦ ✧ ★ ✧ ✦
        </div>
      </article>
    </div>
  );
}

function FileBrowserView({ articles, sourceInfo }: FileBrowserViewProps) {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background grid */}
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          {sourceInfo.avatarUrl && (
            <div className="relative inline-block mb-6">
              <img
                src={sourceInfo.avatarUrl}
                alt={sourceInfo.name}
                className="w-32 h-32 rounded-full border-8 border-yellow-400"
                style={{
                  boxShadow: '0 0 40px #ff00ff, 0 0 80px #00ffff',
                }}
              />
              <div className="absolute -top-2 -right-2 text-4xl animate-bounce">✨</div>
              <div className="absolute -bottom-2 -left-2 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
            </div>
          )}
          <h1
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-4 uppercase"
            style={{
              fontFamily: 'Impact, sans-serif',
              WebkitTextStroke: '2px white',
            }}
          >
            {sourceInfo.name}
          </h1>
          {sourceInfo.bio && (
            <p
              className="text-xl text-cyan-300 font-mono max-w-lg mx-auto"
              style={{ textShadow: '0 0 10px #00ffff' }}
            >
              {sourceInfo.bio}
            </p>
          )}
          <div className="mt-6 text-4xl">
            🪩 ✦ 🌈 ✦ 🪩
          </div>
        </header>

        {/* Article list */}
        <div className="space-y-6">
          {articles.map((article: FileInfo, index: number) => (
            <Link
              key={article.sha}
              href={`/${article.path}`}
              className="block group"
              style={{ transform: `rotate(${index % 2 === 0 ? '1' : '-1'}deg)` }}
            >
              <div
                className="p-6 border-4 border-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 hover:from-yellow-400 hover:via-pink-500 hover:to-cyan-400 transition-all duration-300 group-hover:scale-105 group-hover:rotate-0"
                style={{
                  clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)',
                }}
              >
                <h2
                  className="text-2xl md:text-3xl font-black text-white uppercase mb-3 group-hover:text-black transition-colors"
                  style={{
                    fontFamily: 'Impact, sans-serif',
                    textShadow: '2px 2px 0 #000',
                  }}
                >
                  {article.title}
                </h2>
                <p className="text-sm text-yellow-300 font-mono bg-black/50 inline-block px-3 py-1">
                  {new Date(article.commitInfo.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  <span className="ml-2">→ CLICK 2 READ</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-pink-400 font-mono text-sm mb-4">
            powered by madea-blog-core // bring ur own views
          </p>
          <div className="text-6xl animate-pulse">
            💜 🏳️‍🌈 💜
          </div>
        </footer>
      </div>
    </div>
  );
}

function NoRepoFoundView({ username }: NoRepoFoundViewProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">😱</div>
        <h1
          className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4 uppercase"
          style={{ fontFamily: 'Impact, sans-serif' }}
        >
          OH NO HONEY!
        </h1>
        <p className="text-xl text-pink-400 font-mono">
          Could not find {username}/{REPO}
        </p>
      </div>
    </div>
  );
}

function LandingView(_props: LandingViewProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <h1
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 uppercase animate-pulse"
          style={{ fontFamily: 'Impact, sans-serif' }}
        >
          WELCOME 2 DA BLOG
        </h1>
        <div className="mt-8 text-6xl">🪩✨🌈✨🪩</div>
      </div>
    </div>
  );
}

// ============================================
// Config
// ============================================

const BASE_URL = 'https://blog.pond.audio';

const SEO_CONFIG = {
  baseUrl: BASE_URL,
  siteName: 'blog.pond.audio',
  defaultDescription: 'A funky 90s disco blog',
  authorName: 'jamierpond',
  authorUrl: 'https://github.com/jamierpond',
} as const;

export function createBlogConfig(): MadeaConfigWithSeo {
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
    seo: SEO_CONFIG,
    basePath: '',
  };
}

// Metadata helpers for pages
export async function generateBlogMetadata() {
  const config = createBlogConfig();
  return generateMetadataForIndex(config, {
    title: 'blog.pond.audio',
    description: 'A funky 90s disco blog',
  });
}

export async function generateArticleMetadata(slug: string[]) {
  const config = createBlogConfig();
  return generateMetadataForArticle(config, slug);
}
