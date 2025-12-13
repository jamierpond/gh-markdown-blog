import { getUsername, getRepoPath, getFromGithub, getDefaultBranch, getFileContent, getLastUpdated, extractTitle } from '@/app/shared';

interface FileItem {
  path: string;
  type: string;
}

export async function GET() {
  const username = await getUsername();

  if (!username) {
    return new Response('RSS feed not available', { status: 404 });
  }

  try {
    const repo = await getRepoPath(username);
    const branch = await getDefaultBranch(username);
    const files = await getFromGithub(
      `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`
    );

    if (!files.tree) {
      return new Response('No content found', { status: 404 });
    }

    // Filter markdown files
    const markdownFiles = files.tree.filter(
      (file: FileItem) =>
        file.type === 'blob' &&
        (file.path.endsWith('.md') || file.path.endsWith('.mdx'))
    );

    // Fetch title and last updated for each file
    const articlesPromises = markdownFiles.map(async (file: FileItem) => {
      try {
        const content = await getFileContent(file.path, username);
        const title = extractTitle(content, file.path);
        const lastUpdated = await getLastUpdated(username, file.path);

        // Extract description (first 200 chars after title)
        const contentWithoutTitle = content.replace(/^#[^\n]*\n/, '');
        const firstParagraph = contentWithoutTitle.split('\n\n').find(p => p.trim() && !p.startsWith('#')) || '';
        const description = firstParagraph.slice(0, 200).replace(/[<>&'"]/g, '');

        return {
          path: file.path,
          title,
          lastUpdated,
          description,
        };
      } catch {
        return null;
      }
    });

    const articles = (await Promise.all(articlesPromises)).filter(Boolean);

    // Sort by newest first
    articles.sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });

    // Fetch user data for author info
    let authorName = username;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 },
      });
      if (response.ok) {
        const userData = await response.json();
        authorName = userData.name || username;
      }
    } catch {
      // Use fallback
    }

    const baseUrl = `https://${username}.madea.blog`;
    const buildDate = new Date().toUTCString();

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${authorName}'s Blog</title>
    <link>${baseUrl}</link>
    <description>${authorName}'s blog powered by madea.blog</description>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>madea.blog</generator>
    ${articles.map(article => {
      if (!article) return '';
      const url = `${baseUrl}/${article.path}`;
      const pubDate = new Date(article.lastUpdated).toUTCString();

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${authorName}]]></dc:creator>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
