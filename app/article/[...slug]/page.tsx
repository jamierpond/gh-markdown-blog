// curl -s -H "Accept: application/vnd.github.v3+json" \
//   https://api.github.com/repos/vercel/next.js/contents/packages/next/README.md

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
    return <View data={data} />;
  } catch (error) {
    console.error("Failed to load", error);
    // todo make this return a page or redirect
    throw new Error("Failed to load");
  }
}
