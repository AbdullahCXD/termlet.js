import { TermletNode } from "../renderer";
import { Store } from "./store";

/**
 * A type-safe key-value store for managing TermletNode data.
 * Keys are strings and values are TermletNode instances.
 */
export class NodeStore extends Store<TermletNode> {
  
}

/**
 * A globally accessible instance of NodeStore for managing TermletNode data.
 */
export const GlobalNodeStore = new NodeStore();