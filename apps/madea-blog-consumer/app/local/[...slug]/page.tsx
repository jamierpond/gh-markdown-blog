import { MarkdownView } from "@/app/Components/MarkdownView";
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';
import { extractDescription } from 'madea-blog-core';
import { Metadata } from "next";
import { notFound } from "next/navigation";
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_CONTENT_DIR = path.join(process.cwd(), 'test');

interface Params {
  slug: string[];
}

interface PageProps {
  params: Promise<Params>;
}

function getProvider() {
  return new LocalFsDataProvider({
    contentDir: LOCAL_CONTENT_DIR,
    authorName: 'Local Demo',
    sourceUrl: LOCAL_CONTENT_DIR,
  });
}

async function parseParams(params: Promise<Params>) {
  const p = await params;
  const slug = p.slug as string[];
  const file = slug.join("/");
  return { file };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { file } = await parseParams(params);

  if (!file) {
    return {
      title: "Local Demo",
      description: "Local filesystem blog demo",
    };
  }

  try {
    const provider = getProvider();
    const article = await provider.getArticle(file);

    if (!article) {
      return {
        title: "Article Not Found",
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
      title: "Error",
      description: "Could not load article",
    };
  }
}

export default async function LocalArticlePage({ params }: PageProps) {
  const { file } = await parseParams(params);

  if (!file) {
    notFound();
  }

  try {
    const provider = getProvider();
    const [article, branch] = await Promise.all([
      provider.getArticle(file),
      provider.getDefaultBranch(),
    ]);

    if (!article) {
      notFound();
    }

    return <MarkdownView article={article} username="local" branch={branch} />;
  } catch (error) {
    console.error('[local/[...slug]/page.tsx] Error:', error);
    notFound();
  }
}
