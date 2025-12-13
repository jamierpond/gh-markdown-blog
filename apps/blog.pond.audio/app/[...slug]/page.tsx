import { renderMadeaBlog } from 'madea-blog-core';
import { createBlogConfig } from '../lib/madea-config';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const path = slug.join('/');

  const config = createBlogConfig();
  const result = await renderMadeaBlog(config, path, { hasUsername: true });

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
      notFound();
  }
}
