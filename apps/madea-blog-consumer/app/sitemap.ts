import { MetadataRoute } from 'next';
import { getUsername } from '@/app/shared';
import { createDataProvider } from '@/app/lib/madea-config';
import { headers } from 'next/headers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const username = await getUsername();

  // If no username, just return the root
  if (!username) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
      },
    ];
  }

  try {
    const provider = createDataProvider({ username });
    const articles = await provider.getArticleList();

    // Create sitemap entries
    const sitemapEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];

    // Add each blog post with accurate last modified date
    articles.forEach((article) => {
      sitemapEntries.push({
        url: `${baseUrl}/${article.path}`,
        lastModified: new Date(article.commitInfo.date),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    return sitemapEntries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return just the homepage if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
      },
    ];
  }
}
