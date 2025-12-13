import { renderMadeaBlog } from 'madea-blog-core';
import { createBlogConfig } from './lib/madea-config';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const config = createBlogConfig();
  const result = await renderMadeaBlog(config, '/', { hasUsername: true });

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
