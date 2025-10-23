import path from "path";

export function getTermletDirectory() {
  return path.join(process.cwd(), "termlet");
}