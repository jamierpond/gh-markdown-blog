// Core Types
export type {
  CommitInfo,
  FileInfo,
  SourceInfo,
  DataProvider,
  // View Props Contracts
  ArticleViewProps,
  FileBrowserViewProps,
  NoRepoFoundViewProps,
  LandingViewProps,
} from './data-provider.js';

// Config & Controller
export type { Config, MadeaView, RenderedView } from './config.js';
export { renderMadeaBlog, renderPage, renderMadeaBlogPage } from './config.js';

// Utilities
export {
  extractTitle,
  extractDescription,
  stripTitle,
  isMarkdownFile,
} from './utils.js';

// SEO
export type {
  SitemapEntry,
  BlogSitemapOptions,
  BlogJsonLd,
  BlogPostingJsonLd,
  PersonJsonLd,
  BlogJsonLdOptions,
  ArticleJsonLdOptions,
} from './seo.js';
export {
  generateBlogSitemap,
  generateBlogJsonLd,
  generateArticleJsonLd,
} from './seo.js';
