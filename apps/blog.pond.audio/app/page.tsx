import { renderMadeaBlog, renderPage } from 'madea-blog-core';
import { createBlogConfig } from './lib/madea-config';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const config = createBlogConfig();
  const result = await renderMadeaBlog(config, '/', { hasUsername: true });
  return renderPage(result, notFound);
}
