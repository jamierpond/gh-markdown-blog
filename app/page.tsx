import FileBrowser from "@/app/Components/FileBrowser";
import { REPO, BRANCH } from "@/app/shared";

export default async function Page() {
  if (!REPO || !BRANCH) {
    throw new Error("Repository or branch not specified");
  }
  return <FileBrowser repo={REPO} branch={BRANCH} />; // Pass the repo and branch to FileBrowser
}
