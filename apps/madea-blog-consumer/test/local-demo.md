# Local Filesystem Demo

This article is served directly from the local filesystem using `simple-git` to extract commit metadata.

## How It Works

The `LocalFsDataProvider` reads markdown files from a directory and uses git to get:

- **Last modified date** - from the most recent commit
- **Author name** - from the commit author
- **File history** - tracked via git SHA

## Use Cases

| Use Case | Benefit |
|----------|---------|
| Local development | Preview posts before pushing |
| Static site generation | Build at deploy time |
| Self-hosted blogs | No GitHub API dependency |
| Offline editing | Write anywhere |

## Quick Start

```typescript
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

const provider = new LocalFsDataProvider({
  contentDir: './posts',
  authorName: 'Your Name',
});

const articles = await provider.getArticleList();
const article = await provider.getArticle('hello-world.md');
```

## Task List

- [x] Create LocalFsDataProvider
- [x] Integrate simple-git for metadata
- [x] Add /local demo route
- [x] Write documentation

## Learn More

- [madea-blog-core documentation](/local/madea-blog-core.md)
- [Getting started guide](/local/getting-started.md)
- [Markdown features](/local/markdown-features.md)

---

> "The best way to predict the future is to invent it."
> — Alan Kay
