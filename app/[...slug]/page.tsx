import { MarkdownView } from "@/app/Components/MarkdownView";
import { getFileContent, getLastUpdated, getUsername, extractTitle } from "@/app/shared";
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

    // Extract better description
    const contentWithoutTitle = content.replace(/^#[^\n]*\n/, '');
    const firstParagraph = contentWithoutTitle.split('\n\n').find(p => p.trim() && !p.startsWith('#')) || '';
    const description = firstParagraph.slice(0, 160) || content.slice(0, 160);

    // Calculate reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Get the current URL for canonical and og:url
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${username}.madea.blog`;
    const url = `${baseUrl}/${file}`;

    // Use author's GitHub avatar as the social image
    const socialImage = `https://github.com/${username}.png?size=1200`;

    // Fetch author name
    let authorName = username;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      });
      if (response.ok) {
        const data = await response.json();
        authorName = data.name || username;
      }
    } catch {
      // Use fallback
    }

    return {
      title: `${title}`,
      description: description,
      authors: [{ name: authorName, url: `https://github.com/${username}` }],
      keywords: title.split(' ').concat(['blog', 'article', username]),
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: 'article',
        url: url,
        title: `${title}`,
        description: description,
        siteName: `${authorName}'s Blog`,
        publishedTime: lastUpdated,
        modifiedTime: lastUpdated,
        authors: [authorName],
        images: [
          {
            url: socialImage,
            width: 1200,
            height: 1200,
            alt: authorName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title}`,
        description: description,
        images: [socialImage],
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
