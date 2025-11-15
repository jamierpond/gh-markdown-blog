import FileBrowser from "@/app/Components/FileBrowser";
import PageLayout from "./Components/PageLayout";
import { getUsername } from "./shared";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const username = await getUsername();

  if (!username) {
    return (
      <PageLayout>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="text-7xl mb-8">📝</div>
            <h1 className="text-6xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-6 leading-tight">
              madea.blog
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-400 font-light mb-4">
              Turn your GitHub markdown into a beautiful blog
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500">
              No setup, no config, just push markdown
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-6 mb-16">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Create a GitHub repository
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Create a repo called <code className="text-purple-600 dark:text-purple-400 font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">madea.blog</code> in your GitHub account
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Push markdown files
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Add your <code className="text-purple-600 dark:text-purple-400 font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">.md</code> or <code className="text-purple-600 dark:text-purple-400 font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">.mdx</code> files to the repository
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Visit your blog
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Your blog is live at <code className="text-purple-600 dark:text-purple-400 font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">yourusername.madea.blog</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Get Started on GitHub
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  return <FileBrowser username={username} />;
}
