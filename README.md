# @madea-blog-core

Turn your GitHub repo into a beautiful blog in literally 3 lines of code.

## Wait, what?

Yeah. Three lines. Watch:

```tsx
import { renderMadeaBlog, renderPage } from 'madea-blog-core';

export default async function Page() {
  const config = createConfig('your-github-username');
  const result = await renderMadeaBlog(config, '/');
  return renderPage(result);
}
```

That's it. You now have a blog that reads markdown files directly from your GitHub repo. No build step. No static generation. Just pure, simple, GitHub-powered blogging.

## Why though?

Because setting up a blog shouldn't require a PhD in web development. You already write markdown. You already use GitHub. Why not just... use them?

**madea-blog-core** is a tiny, type-safe library that:
- Fetches markdown files from your GitHub repo
- Renders them beautifully with syntax highlighting
- Handles metadata, SEO, and all that boring stuff
- Provides flexibility for custom styling and components
- Works with Next.js 14+ and React 18+

## Show me more

Here's a slightly more realistic example:

```tsx
import { renderMadeaBlog, renderPage, GitHubDataProvider } from 'madea-blog-core';
import { MarkdownView } from './components/markdown-view';
import { FileBrowser } from './components/file-browser';

export default async function Page() {
  const config = {
    username: 'your-github-username',
    dataProvider: new GitHubDataProvider({
      username: 'your-github-username',
      repo: 'your-blog-repo',
      token: process.env.GITHUB_TOKEN,
    }),
    articleView: MarkdownView,        // Your custom article component
    fileBrowserView: FileBrowser,     // Your custom file browser
  };

  const result = await renderMadeaBlog(config, '/');
  return renderPage(result);
}
```

**That's still like 15 lines.** And you get:
- Full control over how articles render
- Automatic file listing and navigation
- Git commit metadata for publish dates
- Article excerpts for previews
- Type-safe everything

## What's in the box?

### Core API
- `renderMadeaBlog()` - Main rendering function
- `renderPage()` - Converts render result to React components
- `generateMetadata()` - Next.js metadata generation
- Utilities for extracting titles, descriptions, etc.

### Data Providers
- **GitHubDataProvider** - Fetches from GitHub (with smart caching)
- **LocalFsDataProvider** - Local filesystem for development

### View Contracts
Bring your own components or use the defaults:
- `ArticleView` - How individual articles render
- `FileBrowserView` - How the file list displays
- `NoRepoFoundView` - Error states
- `LandingView` - Landing page for multi-tenant setups

## Installation

```bash
pnpm add madea-blog-core
# or
npm install madea-blog-core
```

## Quick Start

1. Create a GitHub repo with some markdown files
2. Get a GitHub token (Settings > Developer settings > Personal access tokens)
3. Add to your Next.js app:

```tsx
// app/page.tsx
import { renderMadeaBlog, renderPage, GitHubDataProvider } from 'madea-blog-core';

const config = {
  username: 'yourusername',
  dataProvider: new GitHubDataProvider({
    username: 'yourusername',
    repo: 'blog',
    token: process.env.GITHUB_TOKEN,
  }),
};

export default async function Page() {
  const result = await renderMadeaBlog(config, '/');
  return renderPage(result);
}
```

4. Set `GITHUB_TOKEN` in your `.env.local`
5. Run `pnpm dev`
6. Write markdown in your repo, push, refresh. Done.

## Architecture

This is a monorepo with:
- **packages/madea-blog-core** - The core library
- **apps/madea-blog-consumer** - Example multi-tenant blog platform
- **apps/blog.pond.audio** - Real-world example
- **apps/golf-blog** - Another real-world example

Check the `apps/` directory for complete working examples.

## Features

- Server Components first (Next.js 14+)
- Smart caching with configurable revalidation
- GitHub Flavored Markdown support
- Syntax highlighting
- Automatic SEO metadata
- RSS/Sitemap generation helpers
- TypeScript all the way down
- Dependency injection for full control

## Local Development

Want to test locally before pushing to GitHub?

```tsx
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

const config = {
  username: 'local',
  dataProvider: new LocalFsDataProvider({
    contentDir: './blog-posts',
    authorName: 'Your Name',
  }),
};
```

Write markdown files in `./blog-posts`, and they'll render instantly. No git required.

## Examples

Check out the working examples in this repo:
- `apps/madea-blog-consumer` - Full-featured multi-tenant platform
- `apps/blog.pond.audio` - Personal blog blog example
- `apps/golf-blog` - Code-golfed madea.blog

## License

MIT
