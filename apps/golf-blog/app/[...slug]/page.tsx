import { renderMadeaBlogPage } from 'madea-blog-core';
import { createBlogConfig, generateArticleMetadata } from '../madea.config';

export const dynamic = 'force-dynamic';

const CONFIG = createBlogConfig();

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generateArticleMetadata(slug);
}

export default async function Page({ params }: PageProps) {
  return renderMadeaBlogPage(CONFIG, params);
}
