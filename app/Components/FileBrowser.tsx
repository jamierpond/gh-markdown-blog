import { getDefaultBranch } from '@/app/shared';
import Link from 'next/link';

export interface FileItem {
  path: string;
  sha: string;
  url: string;
}

// Define a function to get the repository files using REST API since it natively supports recursive listing
async function getRepoFiles(repo: string, branch: string) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  // GitHub's GraphQL API doesn't easily support recursive file listings,
  // so we'll use the Git Data REST API which has built-in support for this
  const url = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;
  
  const res = await fetch(
    url,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      cache: 'force-cache',
      next: { revalidate: 600 }, // 10 minutes
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch repository files");
  }

  const data = await res.json();
  
  if (data.message) {
    throw new Error(`GitHub API Error: ${data.message}`);
  }
  
  return data;
}

export default async function FileBrowser({ repo }: { repo: string }) {
  const branch = await getDefaultBranch(repo);
  const files = await getRepoFiles(repo, branch);
  const tree = files.tree;
  const redirectpath = `/${repo}`;

  if (!tree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-xl font-semibold">Failed to load content!</div>
        <div className="mt-2 text-sm overflow-auto max-w-full">Got: {JSON.stringify(files)}</div>
      </div>
    );
  }

  const markdownFiles = tree.filter(
    (file: FileItem) => file.path.endsWith(".md") || file.path.endsWith(".mdx")
  );

  if (!markdownFiles.length) {
    return <div className="flex items-center justify-center min-h-screen">No articles found</div>;
  }

  // Format file path to display as title
  const formatTitle = (path: string): string => {
    // Remove file extension and replace hyphens/underscores with spaces
    return path
      .replace(/\.(md|mdx)$/, '')
      .replace(/[-_]/g, ' ')
      .split('/')
      .pop() || path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Link href={`https://github.com/${repo}`} className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            <h1>{repo}</h1>
          </Link>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2 pb-4 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {markdownFiles.map((file: FileItem) => (
              <div
                key={file.sha}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-start mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">
                      {formatTitle(file.path)}
                    </h2>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {file.path}
                  </p>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-6 py-4">
                  <Link
                    href={`${redirectpath}/${file.path}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center font-medium"
                  >
                    Read article
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© 2025 {repo}</p>
      </footer>
    </div>
  );
}

