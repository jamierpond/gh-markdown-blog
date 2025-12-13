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
export { renderMadeaBlog } from './config.js';

// Utilities
export {
  extractTitle,
  extractDescription,
  isMarkdownFile,
} from './utils.js';
