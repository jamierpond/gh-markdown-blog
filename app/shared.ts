export const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function getFromGithub(url: string) {
  const res = await fetch(
    url,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from GitHub");
  }

  const data = await res.json();
  return data;
}


