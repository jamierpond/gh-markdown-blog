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
export { renderMadeaBlog, renderPage } from './config';

// Utilities
export {
  extractTitle,
  extractDescription,
  isMarkdownFile,
} from './utils';
