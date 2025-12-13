import FileBrowser from "@/app/Components/FileBrowser";
import PageLayout from "@/app/Components/PageLayout";
import { LocalFsDataProvider } from 'madea-blog-core/providers/local-fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Use the test directory in the consumer app
const LOCAL_CONTENT_DIR = path.join(process.cwd(), 'test');

export default async function LocalPage() {
  const provider = new LocalFsDataProvider({
    contentDir: LOCAL_CONTENT_DIR,
    authorName: 'Local Demo',
    sourceUrl: LOCAL_CONTENT_DIR,
  });

  try {
    const [articles, sourceInfo] = await Promise.all([
      provider.getArticleList(),
      provider.getSourceInfo(),
    ]);

    // Override sourceInfo for the demo
    const demoSourceInfo = {
      ...sourceInfo,
      name: 'Local Filesystem Demo',
      bio: 'This example uses the LocalFsDataProvider with simple-git to read markdown from the local filesystem.',
      avatarUrl: 'https://ui-avatars.com/api/?name=Local+FS&background=8b5cf6&color=fff&size=256&bold=true',
      sourceUrl: '/local',
    };

    return <FileBrowser articles={articles} sourceInfo={demoSourceInfo} username="local" />;
  } catch (error) {
    console.error('[local/page.tsx] Error loading local content:', error);
    return (
      <PageLayout>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Local Content Not Found</h1>
            <p className="text-gray-400 mb-8">
              Could not load content from the local filesystem.
            </p>
            <p className="text-gray-500 text-sm">
              Looking in: <code className="bg-gray-800 px-2 py-1 rounded">{LOCAL_CONTENT_DIR}</code>
            </p>
            <pre className="mt-4 text-left bg-gray-900 p-4 rounded-lg text-red-400 text-sm overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        </div>
      </PageLayout>
    );
  }
}
