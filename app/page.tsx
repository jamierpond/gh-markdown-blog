import FileBrowser from "@/app/Components/FileBrowser";
import { getUsername } from "@/app/shared";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const username = await getUsername();

  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-6">
            Welcome to Madea
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Please access this site via a subdomain
          </p>
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6">
            <code className="text-purple-600 dark:text-purple-400 font-mono">
              username.domain.com
            </code>
          </div>
        </div>
      </div>
    );
  }

  return <FileBrowser username={username} />;
}
