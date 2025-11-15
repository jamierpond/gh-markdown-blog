import { getFromGithub, getDefaultBranch, getRepoPath, getFileContent, extractTitle, getLastUpdated } from '@/app/shared';
import Link from 'next/link';

export interface FileItem {
  path: string;
  sha: string;
  url: string;
}

interface FileWithTitle extends FileItem {
  title: string;
  lastUpdated: string;
}

export default async function FileBrowser({ username }: { username: string }) {
  const repo = await getRepoPath(username);

  let branch, files, tree;
  try {
    branch = await getDefaultBranch(username);
    files = await getFromGithub(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);
    tree = files.tree;
  } catch (error) {
    // Repository doesn't exist - show friendly message
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="mb-8">
            <div className="text-7xl mb-6">📝</div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-6 leading-tight">
              {username} hasn&apos;t made a madea.blog yet!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              You can get started by pushing markdown to
            </p>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8">
            <code className="text-purple-600 dark:text-purple-400 font-mono text-lg block mb-6">
              {username}/madea.blog
            </code>
            <a
              href={`https://github.com/${username}/madea.blog`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Create on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

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

  // Fetch content for each file and extract title and last updated
  const filesWithTitles: FileWithTitle[] = await Promise.all(
    markdownFiles.map(async (file: FileItem) => {
      try {
        const [content, lastUpdated] = await Promise.all([
          getFileContent(file.path, username),
          getLastUpdated(username, file.path)
        ]);
        const title = extractTitle(content, file.path);
        return { ...file, title, lastUpdated };
      } catch {
        // If we can't fetch the file, fall back to formatted filename
        const title = file.path
          .replace(/\.(md|mdx)$/, '')
          .replace(/[-_]/g, ' ')
          .split('/')
          .pop() || file.path;
        return { ...file, title, lastUpdated: new Date().toISOString() };
      }
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href={`https://github.com/${repo}`} className="group inline-block">
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-4 transition-all duration-300 group-hover:scale-105">
              {username}
            </h1>
          </Link>

          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
            Hosted with ❤️ on madea.blog
          </p>
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
                <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
                  {new Date(file.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

