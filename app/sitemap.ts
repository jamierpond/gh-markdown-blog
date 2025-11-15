import { MetadataRoute } from 'next';
import { getUsername, getRepoPath, getFromGithub, getDefaultBranch } from '@/app/shared';
import { headers } from 'next/headers';

interface FileItem {
  path: string;
  type: string;
}

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
    const repo = await getRepoPath(username);
    const branch = await getDefaultBranch(username);
    const files = await getFromGithub(
      `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`
    );

    if (!files.tree) {
      return [
        {
          url: baseUrl,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 1,
        },
      ];
    }

    // Filter markdown files
    const markdownFiles = files.tree.filter(
      (file: FileItem) =>
        file.type === 'blob' &&
        (file.path.endsWith('.md') || file.path.endsWith('.mdx'))
    );

    // Create sitemap entries
    const sitemapEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];

    // Add each blog post
    markdownFiles.forEach((file: FileItem) => {
      sitemapEntries.push({
        url: `${baseUrl}/${file.path}`,
        lastModified: new Date(),
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
