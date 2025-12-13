import { MarkdownView } from "@/app/Components/MarkdownView";
import { getUsername, getGithubUser } from "@/app/shared";
import { extractDescription } from 'madea-blog-core';
import FileBrowser, { NoRepoFound } from "@/app/Components/FileBrowser";
import { getDataProvider } from "@/app/lib/data-provider-factory";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const file = slug.join("/");
  return { file };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const username = await getUsername();

  if (!params || !username) {
    return {
      title: "Blogify your GitHub Repo",
      description: "Blogify your GitHub Repo",
    };
  }

  const { file } = await parseParams(params);

  if (!file) {
    return {
      title: `${username}'s Blog`,
      description: "Blogify your GitHub Repo",
    };
  }

  try {
    const provider = getDataProvider(username);
    const article = await provider.getArticle(file);

    if (!article) {
      return {
        title: "Page Not Found",
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
        card: "summary_large_image",
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
        'reading_time': `${readingTime} min read`,
      },
    };
  } catch {
    return {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const username = await getUsername();

  if (!params || !username) {
    notFound();
  }

  const { file } = await parseParams(params);

  if (!file) {
    // Homepage - show article list
    try {
      const provider = getDataProvider(username);
      const [articles, sourceInfo] = await Promise.all([
        provider.getArticleList(),
        provider.getSourceInfo(),
      ]);

      return <FileBrowser articles={articles} sourceInfo={sourceInfo} username={username} />;
    } catch {
      return <NoRepoFound username={username} />;
    }
  }

  // Article page
  try {
    const provider = getDataProvider(username);
    const [article, branch] = await Promise.all([
      provider.getArticle(file),
      provider.getDefaultBranch(),
    ]);

    if (!article) {
      notFound();
    }

    return <MarkdownView article={article} username={username} branch={branch} />;
  } catch {
    notFound();
  }
}
