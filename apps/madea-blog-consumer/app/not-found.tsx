import Link from "next/link";
import PageLayout from "./components/page-layout";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="relative z-10 text-center max-w-2xl">
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-800/50 p-12 shadow-xl">
          <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-6">
            404
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
