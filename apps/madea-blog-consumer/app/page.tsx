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

  // Render based on result type (discriminated union pattern)
  switch (result.type) {
    case 'article':
      return <result.View {...result.props} />;
    case 'file-browser':
      return <result.View {...result.props} />;
    case 'no-repo-found':
      return <result.View {...result.props} />;
    case 'landing':
      return <result.View {...result.props} />;
    case '404':
      return <div>Page not found</div>;
  }
}
