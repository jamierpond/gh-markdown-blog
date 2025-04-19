// curl -s -H "Accept: application/vnd.github.v3+json" \
//   https://api.github.com/repos/vercel/next.js/contents/packages/next/README.md

import { REPO, BRANCH } from "@/app/shared";

async function getData(file: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${file}?ref=${BRANCH}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch data", res.status, res.statusText);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}


function View ({ data }: { data: any }) {
  const { content, encoding } = data;
  const decodedContent = Buffer.from(content, encoding).toString("utf-8");
  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="text-[24px] font-bold">{data.path}</h2>
      <div className="text-[16px] text-gray-700">
        <pre>{decodedContent}</pre>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: { file: string } }) {
  const file = params.file;
  try {
    const data = await getData(file);
    return <View data={data} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return <div>Failed to load, {message}</div>;
  }
}
