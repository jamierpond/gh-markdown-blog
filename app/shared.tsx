import { AlertIcon } from "@/app/icons/svg";
import Link from "next/link";

export const DEFAULT_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const DEFAULT_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const TEN_MINUTES_SECONDS = 60 * 10;
const ONE_DAY_SECONDS = 60 * 60 * 24;
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

async function queryGraphQL(query: string, variables: Record<string, any>, cacheSeconds: number = TEN_MINUTES_SECONDS) {
  const res = await fetch(
    GITHUB_GRAPHQL_API,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'force-cache',
      next: { revalidate: cacheSeconds },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from GitHub GraphQL API");
  }

  const { data, errors } = await res.json();

  if (errors) {
    throw new Error(`GraphQL Error: ${errors.map((e: any) => e.message).join(', ')}`);
  }

  return data;
}

export async function getDefaultBranch(repo: string) {
  const [owner, name] = repo.split('/');

  const query = `
    query GetDefaultBranch($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          name
        }
      }
    }
  `;

  const variables = {
    owner,
    name
  };

  // Use Next.js built-in caching instead of manual caching
  const data = await queryGraphQL(query, variables, ONE_DAY_SECONDS);

  if (!data.repository?.defaultBranchRef?.name) {
    throw new Error(`Default branch not found for repository ${repo}`);
  }

  return data.repository.defaultBranchRef.name;
}


export async function getPageData(file: string, repo: string) {
  const [owner, name] = repo.split('/');

  // Get default branch and file content in a single query
  const query = `
    query GetFileWithBranch($owner: String!, $name: String!, $expression: String!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          name
        }
        # Use a variable for the expression
        fileContent: object(expression: $expression) {
          ... on Blob {
            oid
            byteSize
            text
          }
        }
      }
    }
  `;

  const variables = {
    owner,
    name,
    expression: `HEAD:${file}` // This will correctly resolve in the GraphQL query
  };

  console.log(`Fetching file ${file} from ${repo}`);
  const data = await queryGraphQL(query, variables, TEN_MINUTES_SECONDS);
  
  if (!data.repository?.fileContent) {
    throw new Error(`File ${file} not found in repository ${repo}`);
  }

  return {
    content: Buffer.from(data.repository.fileContent.text || '').toString('base64'),
    encoding: 'base64',
    size: data.repository.fileContent.byteSize,
    sha: data.repository.fileContent.oid
  };
}

export async function getFileContent(file: string, repo: string) {
  const [owner, name] = repo.split('/');

  // Get default branch and file content in a single query
  const query = `
    query GetFileWithBranch($owner: String!, $name: String!, $expression: String!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          name
        }
        fileContent: object(expression: $expression) {
          ... on Blob {
            text
          }
        }
      }
    }
  `;

  const variables = {
    owner,
    name,
    expression: `HEAD:${file}` // This will correctly resolve in the GraphQL query
  };

  const data = await queryGraphQL(query, variables, TEN_MINUTES_SECONDS);
  
  if (!data.repository?.fileContent?.text) {
    throw new Error(`File ${file} not found in repository ${repo}`);
  }

  return data.repository.fileContent.text;
}

export async function getLastUpdated(repo: string, file: string) {
  const [owner, name] = repo.split('/');

  // Get file content, commit history, and default branch in a single query
  const query = `
    query GetFileWithHistory($owner: String!, $name: String!, $path: String!, $expression: String!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(first: 1, path: $path) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }
        # Also fetch the file content to maximize efficiency
        fileContent: object(expression: $expression) {
          ... on Blob {
            text
          }
        }
      }
    }
  `;

  const variables = {
    owner,
    name,
    path: file,
    expression: `HEAD:${file}`
  };

  const data = await queryGraphQL(query, variables, TEN_MINUTES_SECONDS);

  const commits = data.repository?.defaultBranchRef?.target?.history?.nodes || [];

  if (commits.length === 0) {
    throw new Error("No commits found for this file");
  }

  return commits[0].committedDate;
}


export function ArticleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
        <AlertIcon />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Sorry, we couldn&apos;t find the article you&apos;re looking for.</p>
        <Link href="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}

