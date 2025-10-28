import { Store } from "./store";

/**
 * A generic key-value store for capturing and managing data.
 * Keys are strings and values can be of any type.
 */
export class AnyCaptureStore extends Store<any> {
  
}

/**
 * A globally accessible instance of AnyCaptureStore.
 */
export const GlobalAnyCaptureStore = new AnyCaptureStore();