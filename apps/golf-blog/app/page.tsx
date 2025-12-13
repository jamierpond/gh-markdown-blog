import { renderMadeaBlogPage } from 'madea-blog-core';
import { createBlogConfig } from './lib/madea-config';

export const dynamic = 'force-dynamic';

const CONFIG = createBlogConfig();

export default async function Page() {
  return renderMadeaBlogPage(CONFIG);
}
