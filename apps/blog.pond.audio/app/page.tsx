import { renderMadeaBlogPage } from 'madea-blog-core';
import { createBlogConfig, generateBlogMetadata } from './lib/madea-config';

export const dynamic = 'force-dynamic';

export const generateMetadata = generateBlogMetadata;

const CONFIG = createBlogConfig();

export default async function Page() {
  return renderMadeaBlogPage(CONFIG);
}
