import { renderMadeaBlog, extractDescription } from 'madea-blog-core';
import { createLocalConfig, createDataProvider } from '@/app/lib/madea-config';
import { getUsername } from '@/app/shared';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_CONTENT_DIR = path.join(process.cwd(), 'test');

interface Params {
  slug: string[];
}

interface PageProps {
  params: Promise<Params>;
}

async function parseParams(params: Promise<Params>) {
  const p = await params;
  const slug = p.slug as string[];
  const file = slug.join('/');
  return { file };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // /local routes should only work on the main domain (no subdomain)
  const username = await getUsername();
  if (username) {
    return {
      title: 'Not Found',
      description: 'Page not found',
    };
  }

  const { file } = await parseParams(params);

  if (!file) {
    return {
      title: 'Local Demo',
      description: 'Local filesystem blog demo',
    };
  }

  try {
    // Use the DI pattern for metadata generation
    const provider = createDataProvider({
      username: 'local',
      useLocalFs: true,
      localContentDir: LOCAL_CONTENT_DIR,
    });
    const article = await provider.getArticle(file);

    if (!article) {
      return {
        title: 'Article Not Found',
        description: "The article you're looking for doesn't exist.",
      };
    }

    const { content, title } = article;
    const description = extractDescription(content);

    return {
      title: `${title} | Local Demo`,
      description,
    };
  } catch {
    return {
      title: 'Error',
      description: 'Could not load article',
    };
  }
}

export default async function LocalArticlePage({ params }: PageProps) {
  // /local routes should only work on the main domain (no subdomain)
  const username = await getUsername();
  if (username) {
    notFound();
  }

  const { file } = await parseParams(params);

  if (!file) {
    notFound();
  }

  // Create config with injected dependencies for local mode
  const config = createLocalConfig(LOCAL_CONTENT_DIR);

  // Use the core controller to determine what to render
  const result = await renderMadeaBlog(config, file, { hasUsername: true });

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
      notFound();
  }
}
