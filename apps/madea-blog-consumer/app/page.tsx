import { renderMadeaBlog, renderPage } from 'madea-blog-core';
import { createDefaultConfig } from './lib/madea-config';
import { getUsername } from './shared';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const username = await getUsername();
  const config = createDefaultConfig(username || 'anonymous');
  const result = await renderMadeaBlog(config, '/', { hasUsername: Boolean(username) });
  return renderPage(result);
}
