import { GlobalCaptureStore } from "../../stores";

export function captureInputAnswer(id: string) {
  return GlobalCaptureStore.get(`input-capture-${id}`);
}