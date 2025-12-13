# Welcome to the Local Filesystem Demo

This article is being served directly from your local filesystem using **simple-git** to extract commit metadata.

## How It Works

The `LocalFsDataProvider` reads markdown files from a directory on your machine and uses git to get:

- **Last modified date** - from the most recent commit touching this file
- **Author name** - from the commit author
- **File history** - tracked via git SHA

## Why Local Mode?

| Use Case | Benefit |
|----------|---------|
| Local development | Preview posts before pushing |
| Static site generation | Build at deploy time |
| Self-hosted blogs | No GitHub dependency |
| Offline editing | Write anywhere |

## Code Example

Here's how easy it is to use:

```typescript
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

const provider = new LocalFsDataProvider({
  contentDir: './posts',
  authorName: 'Your Name',
});

const articles = await provider.getArticleList();
```

## Features Supported

- **GitHub Flavored Markdown** with tables, strikethrough, and task lists
- **Syntax highlighting** for code blocks
- **Footnotes** for academic writing[^1]
- **Auto-linked URLs** like https://madea.blog

### Task List Demo

- [x] Create LocalFsDataProvider
- [x] Integrate simple-git for metadata
- [x] Add /local demo route
- [ ] World domination

## Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

---

Thanks for checking out the local mode demo. Edit this file and watch the changes appear instantly.

[^1]: Footnotes are great for citations and side notes.
