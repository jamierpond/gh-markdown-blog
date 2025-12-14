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
} from './data-provider';

// Config & Controller
export type { Config, MadeaView, RenderedView } from './config';
export { renderMadeaBlog, renderPage, renderMadeaBlogPage } from './config';

// Utilities
export {
  extractTitle,
  extractDescription,
  stripTitle,
  isMarkdownFile,
} from './utils';

// SEO
export type {
  SitemapEntry,
  BlogSitemapOptions,
  BlogJsonLd,
  BlogPostingJsonLd,
  PersonJsonLd,
  BlogJsonLdOptions,
  ArticleJsonLdOptions,
} from './seo';
export {
  generateBlogSitemap,
  generateBlogJsonLd,
  generateArticleJsonLd,
} from './seo';
