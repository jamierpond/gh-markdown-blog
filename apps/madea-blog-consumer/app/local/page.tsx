import FileBrowser from '../components/file-browser';
import PageLayout from '../components/page-layout';
import { generateAvatarDataUrl } from '../components/avatar';
import { createDataProvider } from '../lib/madea-config';
import { getUsername } from '../shared';
import { notFound } from 'next/navigation';
import path from 'path';

export const dynamic = 'force-dynamic';

// Use the test directory in the consumer app
const LOCAL_CONTENT_DIR = path.join(process.cwd(), 'test');

export default async function LocalPage() {
  // /local routes should only work on the main domain (no subdomain)
  const username = await getUsername();
  if (username) {
    notFound();
  }

  // Use the DI pattern to create the data provider
  const provider = createDataProvider({
    username: 'local',
    useLocalFs: true,
    localContentDir: LOCAL_CONTENT_DIR,
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
      avatarUrl: generateAvatarDataUrl('Local FS', 256),
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
