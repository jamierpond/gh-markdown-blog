import type { DataProvider, FileInfo } from './data-provider.js';
import { extractDescription } from './utils.js';

/**
 * SEO configuration for generating metadata
 */
export interface SeoConfig {
  baseUrl: string;
  siteName: string;
  defaultDescription?: string;
  defaultImage?: string;
  twitterHandle?: string;
  authorName?: string;
  authorUrl?: string;
}

/**
 * Next.js Metadata-compatible object
 * We don't import from 'next' to keep the core framework-agnostic
 */
export interface MadeaMetadata {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    type: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    site?: string;
    creator?: string;
    images?: string[];
  };
  alternates?: {
    canonical: string;
  };
}

export interface IndexMetadataOptions {
  seo: SeoConfig;
  path: string; // e.g., '/blog' or '/docs'
  title: string;
  description: string;
}

/**
 * Generate metadata for an index/listing page (blog index, docs index)
 */
export function generateIndexMetadata(options: IndexMetadataOptions): MadeaMetadata {
  const { seo, path, title, description } = options;
  const url = `${seo.baseUrl}${path}`;

  const metadata: MadeaMetadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: seo.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: seo.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
  };

  if (seo.defaultImage) {
    metadata.openGraph!.images = [{ url: seo.defaultImage }];
    metadata.twitter!.images = [seo.defaultImage];
  }

  return metadata;
}

export interface ArticleMetadataOptions {
  seo: SeoConfig;
  path: string; // e.g., '/blog' or '/docs'
}

/**
 * Generate metadata for an individual article page
 */
export function generateArticleMetadata(
  article: FileInfo,
  options: ArticleMetadataOptions
): MadeaMetadata {
  const { seo, path } = options;
  const slug = article.path.replace(/\.md$/, '');
  const url = `${seo.baseUrl}${path}/${slug}`;
  const description = extractDescription(article.content) || seo.defaultDescription || '';
  const authorName = seo.authorName || article.commitInfo.authorName;

  const metadata: MadeaMetadata = {
    title: `${article.title} | ${seo.siteName}`,
    description,
    openGraph: {
      title: article.title,
      description,
      url,
      siteName: seo.siteName,
      type: 'article',
      publishedTime: article.commitInfo.date,
      modifiedTime: article.commitInfo.date,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      site: seo.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
  };

  if (seo.defaultImage) {
    metadata.openGraph!.images = [{ url: seo.defaultImage }];
    metadata.twitter!.images = [seo.defaultImage];
  }

  return metadata;
}

/**
 * Helper to fetch article and generate metadata in one call.
 * Returns null if article not found.
 */
export async function generateArticleMetadataFromSlug(
  dataProvider: DataProvider,
  slug: string[],
  options: ArticleMetadataOptions
): Promise<MadeaMetadata | null> {
  const slugWithExtension = [...slug];
  slugWithExtension[slugWithExtension.length - 1] += '.md';
  const path = slugWithExtension.join('/');

  const article = await dataProvider.getArticle(path);
  if (!article) return null;

  return generateArticleMetadata(article, options);
}

