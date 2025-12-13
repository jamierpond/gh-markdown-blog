import { renderMadeaBlog } from 'madea-blog-core';
import { createDefaultConfig } from './lib/madea-config';
import { getUsername } from './shared';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const username = await getUsername();
  const hasUsername = Boolean(username);

  // Create config with injected dependencies
  // For landing page (no username), we still need a config but it won't be used for data fetching
  const config = createDefaultConfig(username || 'anonymous');

  // Use the core controller to determine what to render
  const result = await renderMadeaBlog(config, '/', { hasUsername });

  // Handle 404 case (shouldn't happen for root path, but handle it)
  if (result.type === '404') {
    return <div>Page not found</div>;
  }

  // Render the injected view with its props
  const { View, props } = result;
  return <View {...props} />;
}
