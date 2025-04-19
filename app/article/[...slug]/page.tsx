import { REPO, BRANCH, GITHUB_TOKEN } from "@/app/shared";
import { View } from "@/app/MarkdownView";

async function getData(file: string) {
  console.log("Fetching data for file:", file);
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${file}?ref=${BRANCH}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch data", res.status, res.statusText);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  console.log("Page params:", params);
  const file = params.slug.join("/");
  
  try {
    const data = await getData(file);
    console.log("Data fetched:", data);
    
    // Format file name for display (remove extension, replace hyphens/underscores)
    const formatTitle = (path: string): string => {
      return path
        .replace(/\.(md|mdx)$/, '')
        .replace(/[-_]/g, ' ')
        .split('/')
        .pop() || path;
    };
    
    const title = formatTitle(file);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to articles
            </a>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            {title}
          </h1>
          
          <View data={data} />
        </div>
        
        <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} {REPO}</p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Failed to load", error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Article
          </h1>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            We couldn't load the article you requested. The file may have been moved or deleted.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to articles
          </a>
        </div>
      </div>
    );
  }
}