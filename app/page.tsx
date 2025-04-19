import FileBrowser from "@/app/Components/FileBrowser";
import { REPO } from "@/app/shared";

export default async function Page() {
  if (!REPO) {
    throw new Error("Repository or branch not specified");
  }
  return <FileBrowser repo={REPO} />; // Pass the repo and branch to FileBrowser
}
