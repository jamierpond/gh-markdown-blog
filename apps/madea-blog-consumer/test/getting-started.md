# Getting Started with madea.blog

Start your blog in under a minute. No config, no setup, just markdown.

## Three Simple Steps

### 1. Create a Repository

Create a new GitHub repository called `madea.blog` in your account.

### 2. Add Markdown Files

Push any `.md` or `.mdx` files to the repository:

```markdown
# My First Post

Hello world! This is my first blog post.

## Why madea.blog?

- Zero configuration
- GitHub-powered
- Beautiful by default
```

### 3. Visit Your Blog

Your blog is instantly live at `yourusername.madea.blog`.

## Features

- **GitHub Flavored Markdown** - Tables, task lists, syntax highlighting
- **Automatic metadata** - Author info and dates from git commits
- **SEO optimized** - Open Graph images, structured data, sitemaps
- **Dark mode** - Automatic theme switching
- **Fast** - Optimized for performance

## Advanced Usage

### For Developers

Want to build your own platform? Check out [madea-blog-core](/local/madea-blog-core.md) - the library that powers madea.blog.

### Local Development

Use the `LocalFsDataProvider` to preview posts before pushing:

```typescript
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';

const provider = new LocalFsDataProvider({
  contentDir: './posts',
});

const articles = await provider.getArticleList();
```

See the [Local Demo](/local) for a live example.

---

Ready to start? [Create your repository on GitHub](https://github.com/new).
