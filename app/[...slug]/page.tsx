import { MarkdownView } from "@/app/Components/MarkdownView";
import { getFileContent, getLastUpdated, getUsername, extractTitle, getGithubUser } from "@/app/shared";
import FileBrowser from "@/app/Components/FileBrowser";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Params {
  // tied to name of the folder in the file system
  slug: string[];
}

interface PageProps {
  params: Promise<Params>;
}

async function parseParams(params: Promise<Params>) {
  const p = await params;
  const slug = p.slug as string[];
  // Now slug only represents the file path (no repo info)
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
    const content = await getFileContent(file, username);
    const title = extractTitle(content, file);
    const lastUpdated = await getLastUpdated(username, file);

    // Extract better description - aim for 155-160 characters
    const contentWithoutTitle = content.replace(/^#[^\n]*\n/, '');
    const firstParagraph = contentWithoutTitle.split('\n\n').find(p => p.trim() && !p.startsWith('#')) || '';
    let description = firstParagraph.slice(0, 300).trim();

    // If description is too short, try to get more content
    if (description.length < 100) {
      const secondParagraph = contentWithoutTitle.split('\n\n').filter(p => p.trim() && !p.startsWith('#'))[1] || '';
      description = (firstParagraph + ' ' + secondParagraph).slice(0, 300).trim();
    }

    // Truncate at sentence boundary if possible, aim for ~155 chars
    if (description.length > 155) {
      const sentenceEnd = description.slice(0, 155).lastIndexOf('.');
      if (sentenceEnd > 100) {
        description = description.slice(0, sentenceEnd + 1);
      } else {
        description = description.slice(0, 155) + '...';
      }
    }

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
    const ogImageUrl = `${baseUrl}/og/article?title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&username=${encodeURIComponent(username)}&date=${encodeURIComponent(lastUpdated)}`;

    // Create rich, descriptive title with context (aim for 50-60 chars)
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
        publishedTime: lastUpdated,
        modifiedTime: lastUpdated,
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
        'article:published_time': lastUpdated,
        'article:modified_time': lastUpdated,
        'article:author': authorName,
        'reading_time': `${readingTime} min read`,
      },
    };
  } catch {
    // If file doesn't exist, return basic metadata
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
    return <FileBrowser username={username} />;
  }

  try {
    const content = await getFileContent(file, username);
    const lastUpdated = await getLastUpdated(username, file);
    const title = extractTitle(content, file);
    return <MarkdownView content={content} path={file} lastUpdated={lastUpdated} title={title} username={username} />;
  } catch {
    notFound();
  }
}
