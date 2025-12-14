import type { DataProvider, FileInfo } from './data-provider.js';
import { extractDescription } from './utils.js';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface BlogSitemapOptions {
  baseUrl: string;
  blogPath?: string; // defaults to '/blog'
}

/**
 * Generates sitemap entries for the blog index and all articles.
 * Use this in your Next.js sitemap.ts file.
 */
export async function generateBlogSitemap(
  dataProvider: DataProvider,
  options: BlogSitemapOptions
): Promise<SitemapEntry[]> {
  const { baseUrl, blogPath = '/blog' } = options;
  const entries: SitemapEntry[] = [];

  try {
    const articles = await dataProvider.getArticleList();

    // Blog index page
    const latestArticle = articles[0];
    entries.push({
      url: `${baseUrl}${blogPath}`,
      lastModified: latestArticle ? new Date(latestArticle.commitInfo.date) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Individual articles
    for (const article of articles) {
      const slug = article.path.replace(/\.md$/, '');
      entries.push({
        url: `${baseUrl}${blogPath}/${slug}`,
        lastModified: new Date(article.commitInfo.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch {
    // Return empty if data provider fails
  }

  return entries;
}

// ============================================
// JSON-LD Types
// ============================================

export interface BlogJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Blog';
  name: string;
  description: string;
  url: string;
  author?: PersonJsonLd;
  blogPost?: BlogPostingJsonLd[];
}

export interface BlogPostingJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author?: PersonJsonLd;
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface PersonJsonLd {
  '@type': 'Person';
  name: string;
  url?: string;
}

export interface BlogJsonLdOptions {
  baseUrl: string;
  blogPath?: string;
  blogName: string;
  blogDescription: string;
  authorName?: string;
  authorUrl?: string;
}

/**
 * Generates JSON-LD structured data for the blog index page.
 */
export async function generateBlogJsonLd(
  dataProvider: DataProvider,
  options: BlogJsonLdOptions
): Promise<BlogJsonLd> {
  const { baseUrl, blogPath = '/blog', blogName, blogDescription, authorName, authorUrl } = options;

  const jsonLd: BlogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogName,
    description: blogDescription,
    url: `${baseUrl}${blogPath}`,
  };

  if (authorName) {
    jsonLd.author = {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    };
  }

  try {
    const articles = await dataProvider.getArticleList();
    jsonLd.blogPost = articles.slice(0, 10).map((article) => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: extractDescription(article.content),
      url: `${baseUrl}${blogPath}/${article.path.replace(/\.md$/, '')}`,
      datePublished: article.commitInfo.date,
      dateModified: article.commitInfo.date,
    }));
  } catch {
    // Skip blog posts if data provider fails
  }

  return jsonLd;
}

export interface ArticleJsonLdOptions {
  baseUrl: string;
  blogPath?: string;
  authorName?: string;
  authorUrl?: string;
}

/**
 * Generates JSON-LD structured data for an individual article.
 */
export function generateArticleJsonLd(
  article: FileInfo,
  options: ArticleJsonLdOptions
): BlogPostingJsonLd {
  const { baseUrl, blogPath = '/blog', authorName, authorUrl } = options;
  const slug = article.path.replace(/\.md$/, '');
  const url = `${baseUrl}${blogPath}/${slug}`;

  const jsonLd: BlogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: extractDescription(article.content),
    url,
    datePublished: article.commitInfo.date,
    dateModified: article.commitInfo.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  const author = authorName || article.commitInfo.authorName;
  if (author) {
    jsonLd.author = {
      '@type': 'Person',
      name: author,
      url: authorUrl,
    };
  }

  return jsonLd;
}
