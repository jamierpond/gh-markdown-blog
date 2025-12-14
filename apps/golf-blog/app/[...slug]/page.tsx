import { renderMadeaBlogPage } from 'madea-blog-core';
import { createBlogConfig } from '../madea.config';

export const dynamic = 'force-dynamic';

const CONFIG = createBlogConfig();

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  return renderMadeaBlogPage(CONFIG, params);
}
