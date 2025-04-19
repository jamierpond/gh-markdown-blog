# gh-markdown-blog

A modern, elegant Markdown viewer for GitHub repositories, built with Next.js 15, React 19, and TailwindCSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjamierpond%2Fgh-markdown-blog)

## Features

- 🔄 Automatically fetches and displays Markdown files from a GitHub repository
- 📱 Fully responsive design works on all devices
- 🌙 Light and dark mode support
- 🎨 Beautiful syntax highlighting for code blocks
- 📊 Support for tables, images, and other GitHub Flavored Markdown

## Getting Started

1. Clone the repository
2. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_GITHUB_REPO=your-username/your-repo
   NEXT_PUBLIC_GITHUB_BRANCH=main
   GITHUB_TOKEN=your-github-token
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

The simplest way to deploy is using the Vercel Deploy button above. You'll just need to set your environment variables after clicking.

## How It Works

gh-markdown-blog connects to the GitHub API to fetch Markdown files from your specified repository. It then renders these files with a beautiful, customized interface using React Markdown with syntax highlighting, GitHub Flavored Markdown support, and other enhancements.

## Tech Stack

- **Next.js 15**: Server components, App Router, optimized builds
- **React 19**: Latest React features including concurrent rendering
- **TailwindCSS 4**: For responsive, utility-first styling
- **TypeScript**: Type safety throughout the codebase
- **GitHub API**: For fetching repository content
- **React Markdown**: For rendering Markdown content
- **Rehype/Remark plugins**: For Markdown enhancements

## License

MIT