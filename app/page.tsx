import FileBrowser from "@/app/Components/FileBrowser";
import { getUsername } from "@/app/shared";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const username = await getUsername();

  if (!username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Username Found</h1>
          <p className="text-gray-600">Please access this site via a subdomain (e.g., username.domain.com)</p>
        </div>
      </div>
    );
  }

  return <FileBrowser username={username} />;
}
