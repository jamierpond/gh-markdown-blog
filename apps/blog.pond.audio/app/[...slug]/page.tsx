import { renderMadeaBlog, renderPage } from 'madea-blog-core';
import { createBlogConfig } from '@/app/lib/madea-config';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const config = createBlogConfig();
  const result = await renderMadeaBlog(config, slug.join('/'), { hasUsername: true });
  return renderPage(result);
}
