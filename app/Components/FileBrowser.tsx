import { getFromGithub, getDefaultBranch, getRepoPath, getFileContent, extractTitle } from '@/app/shared';
import Link from 'next/link';

export interface FileItem {
  path: string;
  sha: string;
  url: string;
}

interface FileWithTitle extends FileItem {
  title: string;
}

export default async function FileBrowser({ username }: { username: string }) {
  const repo = await getRepoPath(username);
  const branch = await getDefaultBranch(username);
  const files = await getFromGithub(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);
  const tree = files.tree;

  if (!tree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-xl font-semibold">Failed to load content!</div>
        <div className="mt-2 text-sm overflow-auto max-w-full">Got: {JSON.stringify(files)}</div>
      </div>
    );
  }

  const markdownFiles = files.tree.filter(
    (file: FileItem) => file.path.endsWith(".md") || file.path.endsWith(".mdx")
  );

  if (!markdownFiles.length) {
    return <div className="flex items-center justify-center min-h-screen">No articles found</div>;
  }

  // Fetch content for each file and extract title
  const filesWithTitles: FileWithTitle[] = await Promise.all(
    markdownFiles.map(async (file: FileItem) => {
      try {
        const content = await getFileContent(file.path, username);
        const title = extractTitle(content, file.path);
        return { ...file, title };
      } catch {
        // If we can't fetch the file, fall back to formatted filename
        const title = file.path
          .replace(/\.(md|mdx)$/, '')
          .replace(/[-_]/g, ' ')
          .split('/')
          .pop() || file.path;
        return { ...file, title };
      }
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href={`https://github.com/${repo}`} className="group inline-block">
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-4 transition-all duration-300 group-hover:scale-105">
              {username}
            </h1>
          </Link>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">Thoughts, stories and ideas</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filesWithTitles.map((file: FileWithTitle) => (
            <Link
              key={file.sha}
              href={`/${file.path}`}
              className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 hover:border-gray-300 dark:hover:border-gray-700"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>

              <div className="relative p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 transition-all duration-300">
                  {file.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 line-clamp-1">
                  {file.path}
                </p>

                {/* Read more indicator */}
                <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  <span>Read article</span>
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-24 pb-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} {username}
        </p>
      </footer>
    </div>
  );
}

