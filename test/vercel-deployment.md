# Deploying to Vercel

gh-markdown-blog is designed to be deployed easily on Vercel, a platform from the creators of Next.js. This guide will walk you through the deployment process.

## Why Vercel?

Vercel offers several advantages for deploying Next.js applications:

- Zero-configuration deployments
- Automatic HTTPS
- Global CDN
- Serverless functions support
- Easy environment variable management
- Preview deployments for pull requests
- Free tier for hobby projects

## Deployment Steps

### 1. Prepare Your Repository

Ensure your project is pushed to a GitHub, GitLab, or Bitbucket repository.

### 2. Connect to Vercel

1. Sign up or log in to [Vercel](https://vercel.com)
2. Click "Add New..." → "Project"
3. Connect to your git provider (GitHub, GitLab, or Bitbucket)
4. Select your gh-markdown-blog repository

### 3. Configure Your Project

Vercel will automatically detect that you're using Next.js and configure the build settings accordingly. However, you'll need to add your environment variables:

- Click "Environment Variables"
- Add the following variables:
  - `NEXT_PUBLIC_GITHUB_REPO` (your GitHub username/repo name)
  - `NEXT_PUBLIC_GITHUB_BRANCH` (usually "main")
  - `GITHUB_TOKEN` (your GitHub personal access token)

### 4. Deploy

Click "Deploy" and Vercel will:
1. Clone your repository
2. Install dependencies
3. Build your application
4. Deploy globally to their CDN

Within a few minutes, your site will be live with a URL like `your-project.vercel.app`.

## Custom Domains

To use a custom domain:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain name
4. Follow Vercel's instructions to configure your DNS settings

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- When you push to your main branch
- When pull requests are opened (as preview deployments)

## Environment Variables Management

For sensitive information like your GitHub token, Vercel provides secure environment variable management:

1. Go to your project settings
2. Click "Environment Variables"
3. You can add, edit, or remove variables here
4. You can also specify different values for Production, Preview, and Development environments

## Monitoring and Logs

Vercel provides:
- Deployment logs
- Function execution logs
- Analytics (on paid plans)
- Status monitoring

## Troubleshooting

If your deployment fails, check:
1. Build logs for errors
2. That all required environment variables are set
3. That your GitHub token has the necessary permissions
4. That your repository is accessible with the provided token

## Cost

Vercel offers a generous free tier that's suitable for most personal projects. Paid plans are available for teams and higher usage requirements.