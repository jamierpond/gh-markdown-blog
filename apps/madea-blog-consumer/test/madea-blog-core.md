# Introducing madea-blog-core

The core library that powers madea.blog - now available for you to build your own markdown-powered blog platform.

## What is madea-blog-core?

`madea-blog-core` is a TypeScript library that provides a unified interface for fetching and rendering markdown content from multiple sources. Whether you're pulling content from GitHub or reading files from your local filesystem, the API stays the same.

## The DataProvider Pattern

At the heart of the library is the `DataProvider` interface:

```typescript
interface DataProvider {
  getArticleList(): Promise<FileInfo[]>;
  getArticle(path: string): Promise<FileInfo | null>;
  getSourceInfo(): Promise<SourceInfo>;
  getDefaultBranch(): Promise<string>;
}
```

This abstraction lets you swap data sources without changing your application code.

## Two Built-in Providers

### GitHubDataProvider

Fetches markdown content directly from any GitHub repository using the GitHub API:

```typescript
import { GitHubDataProvider } from 'madea-blog-core/providers/github';

const provider = new GitHubDataProvider({
  username: 'jamierpond',
  repo: 'madea.blog',
  token: process.env.GITHUB_TOKEN, // optional, for higher rate limits
});

const articles = await provider.getArticleList();
```

Features:
- Fetches commit metadata (author, date, avatar)
- Supports private repos with authentication
- Caches responses for performance

### LocalFsDataProvider

Reads markdown from your local filesystem with git metadata via `simple-git`:

```typescript
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

const provider = new LocalFsDataProvider({
  contentDir: './posts',
  authorName: 'Your Name',
});

const articles = await provider.getArticleList();
```

Features:
- Extracts commit info using simple-git
- Falls back to file modification times
- Great for local development and static site generation

## Utility Functions

The library also exports helpful utilities:

```typescript
import {
  extractTitle,      // Get title from markdown (first h1 or filename)
  extractDescription, // Get description for SEO
  isMarkdownFile,    // Check if file is .md or .mdx
} from 'madea-blog-core';
```

## Installation

```bash
npm install madea-blog-core
# or
pnpm add madea-blog-core
```

## Build Your Own

With `madea-blog-core`, you can build:

- **Personal blogs** - Host your own madea.blog-style site
- **Documentation sites** - Pull docs from GitHub repos
- **Static site generators** - Use LocalFsDataProvider at build time
- **Multi-tenant platforms** - Create your own `username.yourdomain.com` service

## Open Source

The library is MIT licensed and open for contributions. Check it out on [GitHub](https://github.com/jamierpond/madea-blog-core).

---

Try the [Local Demo](/local) to see LocalFsDataProvider in action, or visit [madea.blog](https://madea.blog) to start your own GitHub-powered blog.
