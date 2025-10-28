import { GlobalNodeStore } from "../../stores/node-store";

export function getNodeById(id: string) {
  return GlobalNodeStore.get(id);
}