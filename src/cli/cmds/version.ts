import { version } from "../../../package.json";

export function versionCMD() {
  let system;

  if (process.platform === "win32") system = "Windows";
  else if (process.platform === "darwin") system = "MacOS";
  else system = "Unix/Linux";

  console.log(`Termlet version v${version} (Currently running on ${system})`)
}