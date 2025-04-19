# Getting Started with gh-markdown-blog

Welcome to gh-markdown-blog! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have:

- Node.js 20.x or later
- A GitHub account
- A GitHub Personal Access Token with repo scope

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gh-markdown-blog.git
cd gh-markdown-blog
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following environment variables:

```
NEXT_PUBLIC_GITHUB_REPO=your-username/your-repo
NEXT_PUBLIC_GITHUB_BRANCH=main
GITHUB_TOKEN=your-github-personal-access-token
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see your application.

## Deployment on Vercel

Deploying to Vercel is incredibly simple:

1. Push your repository to GitHub
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "Import Project" and select your GitHub repository
4. Add your environment variables:
   - `NEXT_PUBLIC_GITHUB_REPO`
   - `NEXT_PUBLIC_GITHUB_BRANCH` 
   - `GITHUB_TOKEN`
5. Click "Deploy"

Vercel will automatically detect Next.js and apply the optimal build settings. Within minutes, your site will be live with a URL like `your-project.vercel.app`.

## Configuration Options

You can customize the behavior of gh-markdown-blog by modifying the environment variables:

- `NEXT_PUBLIC_GITHUB_REPO`: The GitHub repository to fetch Markdown files from
- `NEXT_PUBLIC_GITHUB_BRANCH`: The branch to use (default: main)
- `GITHUB_TOKEN`: Your GitHub Personal Access Token

## Next Steps

- Add your own Markdown files to your GitHub repository
- Customize the styling in `app/globals.css`
- Explore the component structure to understand how the app works

Happy coding!