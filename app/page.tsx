import FileBrowser from "@/app/Components/FileBrowser";
import { DEFAULT_REPO } from "@/app/shared";

export default async function Page() {
  if (!DEFAULT_REPO) {
    throw new Error("Repository or branch not specified");
  }
  return <FileBrowser repo={DEFAULT_REPO} />; // Pass the repo and branch to FileBrowser
}
