import { getUsername } from '../shared';
import { extractDescription } from 'madea-blog-core';
import { createDataProvider } from '../lib/madea-config';

export async function GET() {
  const username = await getUsername();

  if (!username) {
    return new Response('RSS feed not available', { status: 404 });
  }

  try {
    const provider = createDataProvider({ username });
    const [articles, sourceInfo] = await Promise.all([
      provider.getArticleList(),
      provider.getSourceInfo(),
    ]);

    if (!articles.length) {
      return new Response('No content found', { status: 404 });
    }

    // Fetch full content for each article for better descriptions
    const articlesWithContent = await Promise.all(
      articles.map(async (article) => {
        try {
          const fullArticle = await provider.getArticle(article.path);
          if (!fullArticle) return null;

          const description = extractDescription(fullArticle.content).replace(/[<>&'"]/g, '');
          return {
            path: fullArticle.path,
            title: fullArticle.title,
            lastUpdated: fullArticle.commitInfo.date,
            description,
          };
        } catch {
          return null;
        }
      })
    );

    const validArticles = articlesWithContent.filter(Boolean);

    // Sort by newest first
    validArticles.sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });

    const authorName = sourceInfo.name;
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
    ${validArticles.map(article => {
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
