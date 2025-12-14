import { renderMadeaBlog, renderPage, extractDescription } from 'madea-blog-core';
import { createDefaultConfig, createDataProvider } from '../lib/madea-config';
import { getUsername, getGithubUser } from '../shared';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Params {
  slug: string[];
}

interface PageProps {
  params: Promise<Params>;
}

async function parseParams(params: Promise<Params>) {
  const p = await params;
  const slug = p.slug as string[];
  const file = slug.join('/');
  return { file };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const username = await getUsername();

  if (!params || !username) {
    return {
      title: 'Blogify your GitHub Repo',
      description: 'Blogify your GitHub Repo',
    };
  }

  const { file } = await parseParams(params);

  if (!file) {
    return {
      title: `${username}'s Blog`,
      description: 'Blogify your GitHub Repo',
    };
  }

  try {
    // Use the DI pattern for metadata generation too
    const dataProvider = createDataProvider({ username });
    const article = await dataProvider.getArticle(file);

    if (!article) {
      return {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist.",
      };
    }

    const { content, commitInfo, title } = article;
    const description = extractDescription(content);

    // Calculate reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Get the current URL for canonical and og:url
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${username}.madea.blog`;
    const url = `${baseUrl}/${file}`;

    // Fetch author name
    let authorName = username;
    const userData = await getGithubUser(username);
    if (userData) {
      authorName = userData.name || username;
    }

    // Create dynamic OG image URL
    const ogImageUrl = `${baseUrl}/og/article?title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&username=${encodeURIComponent(username)}&date=${encodeURIComponent(commitInfo.date)}`;

    // Create rich, descriptive title with context
    const pageTitle = `${title} | ${authorName}'s Blog`;

    return {
      title: pageTitle,
      description: description,
      authors: [{ name: authorName, url: `https://github.com/${username}` }],
      keywords: title.split(' ').concat(['blog', 'article', username, authorName]),
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: 'article',
        url: url,
        title: pageTitle,
        description: description,
        siteName: `${authorName}'s Blog`,
        publishedTime: commitInfo.date,
        modifiedTime: commitInfo.date,
        authors: [authorName],
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${title} by ${authorName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: description,
        images: [ogImageUrl],
        creator: `@${username}`,
        site: '@madeablog',
      },
      other: {
        'article:published_time': commitInfo.date,
        'article:modified_time': commitInfo.date,
        'article:author': authorName,
        reading_time: `${readingTime} min read`,
      },
    };
  } catch {
    return {
      title: 'Page Not Found',
      description: "The page you're looking for doesn't exist.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const username = await getUsername();
  if (!params || !username) notFound();

  const { file } = await parseParams(params);
  const config = createDefaultConfig(username);
  const result = await renderMadeaBlog(config, file || '/', { hasUsername: true });
  return renderPage(result);
}
