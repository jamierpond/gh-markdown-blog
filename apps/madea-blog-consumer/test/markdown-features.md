# Markdown Features

madea.blog supports GitHub Flavored Markdown with syntax highlighting, tables, and more.

## Text Formatting

**Bold text**, *italic text*, and ~~strikethrough~~ are all supported.

## Code

Inline code: `const greeting = "Hello!";`

Code blocks with syntax highlighting:

```typescript
interface Article {
  title: string;
  content: string;
  author: string;
}

async function fetchArticles(): Promise<Article[]> {
  const response = await fetch('/api/articles');
  return response.json();
}
```

```python
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## Tables

| Feature | Supported |
|---------|-----------|
| Tables | Yes |
| Task lists | Yes |
| Footnotes | Yes |
| Syntax highlighting | Yes |
| Auto-linking | Yes |

## Lists

### Unordered

- First item
- Second item
  - Nested item
- Third item

### Ordered

1. Step one
2. Step two
3. Step three

### Task Lists

- [x] Write markdown
- [x] Push to GitHub
- [ ] Profit

## Blockquotes

> "Simplicity is the ultimate sophistication."
> — Leonardo da Vinci

## Links and Images

[Visit madea.blog](https://madea.blog)

Images are automatically centered and styled:

![Placeholder](https://via.placeholder.com/600x300/6366f1/ffffff?text=madea.blog)

## Footnotes

Here's a reference to a footnote[^1].

[^1]: Footnotes appear at the bottom of the article.

## Horizontal Rules

Use three dashes for a divider:

---

That's it! Write markdown, push to GitHub, and madea.blog handles the rest.
