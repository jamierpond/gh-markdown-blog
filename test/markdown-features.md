# Markdown Features Supported

ScottBruceHeart has excellent support for GitHub Flavored Markdown. This document showcases the various Markdown features available.

## Text Formatting

**Bold text** and *italic text* are supported.

You can also use ~~strikethrough~~ text.

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 1
  - Nested item 2
- Item 3

### Ordered Lists

1. First item
2. Second item
   1. Nested item 1
   2. Nested item 2
3. Third item

## Code

Inline code: `const example = "Hello World";`

Code blocks with syntax highlighting:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

## Tables

| Name  | Type    | Default | Description       |
|-------|---------|---------|-------------------|
| id    | number  | -       | Unique identifier |
| name  | string  | ""      | User's name       |
| active| boolean | false   | Is user active?   |

## Blockquotes

> This is a blockquote
> 
> It can span multiple lines

## Links

[Visit GitHub](https://github.com)

## Images

You can add images:

![Next.js Logo](https://nextjs.org/static/images/nextjs-logo-dark.svg)

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Horizontal Rule

---

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Emojis

GitHub-style emojis: :smile: :rocket: :octocat:

## Math (if supported by plugins)

Inline math: $E=mc^2$

Block math:

$$
\frac{d}{dx}(e^x) = e^x
$$

## Diagrams (if supported by plugins)

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```