import { TermletNode } from "../../renderer";
import { GlobalAnyCaptureStore } from "../../stores/any-capture-store";

export type CFMethodContext = {
  node: TermletNode;
}

export type CFMethodCallback = (context: CFMethodContext) => void;

export function createFunctionMethod(name: string, func: CFMethodCallback) {
  GlobalAnyCaptureStore.set(`functions_${name}`, func);
}

export function getFunctionMethod(name: string): CFMethodCallback | undefined {
  return GlobalAnyCaptureStore.get(`functions_${name}`) as CFMethodCallback | undefined;
}