import { Store } from "./store";

/**
 * A generic key-value store for capturing and managing data.
 * Keys are strings and values can be of string type.
 */
export class CaptureStore extends Store<string> {
  
}

/**
 * A globally accessible instance of CaptureStore.
 */
export const GlobalCaptureStore = new CaptureStore();