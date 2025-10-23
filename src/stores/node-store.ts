import { TermletNode } from "../renderer";

/**
 * A type-safe key-value store for managing TermletNode data.
 * Keys are strings and values are TermletNode instances.
 */
export class NodeStore {
  private store: Map<string, TermletNode> = new Map();

  constructor() {}

  /**
   * Stores a TermletNode under the specified key.
   * @param key - The key to associate with the value.
   * @param value - The TermletNode to store.
   */
  set(key: string, value: TermletNode): void {
    this.store.set(key, value);
  }

  /**
   * Retrieves the TermletNode associated with a key.
   * @param key - The key to retrieve.
   * @returns The TermletNode if found, otherwise undefined.
   */
  get(key: string): TermletNode | undefined {
    return this.store.get(key);
  }

  /**
   * Checks if a key exists in the store.
   * @param key - The key to check.
   * @returns True if the key exists, false otherwise.
   */
  has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Removes a key and its associated TermletNode from the store.
   * @param key - The key to delete.
   * @returns True if the key was deleted, false if it did not exist.
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clears all key-value pairs from the store.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Lists all keys currently stored.
   * @returns An array of keys.
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Lists all TermletNode values currently stored.
   * @returns An array of TermletNode values.
   */
  values(): TermletNode[] {
    return Array.from(this.store.values());
  }

  /**
   * Lists all entries as [key, TermletNode] pairs.
   * @returns An array of key-value tuples.
   */
  entries(): [string, TermletNode][] {
    return Array.from(this.store.entries());
  }

  /**
   * Converts the store to a plain object.
   * @returns An object mapping keys to TermletNode values.
   */
  toObject(): Record<string, TermletNode> {
    const obj: Record<string, TermletNode> = {};
    for (const [key, value] of this.store.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Loads key-TermletNode pairs from a plain object into the store.
   * @param obj - The object to load from.
   */
  fromObject(obj: Record<string, TermletNode>): void {
    for (const [key, value] of Object.entries(obj)) {
      this.set(key, value);
    }
  }

  /**
   * Returns the total number of entries in the store.
   * @returns The number of stored items.
   */
  size(): number {
    return this.store.size;
  }
}

/**
 * A globally accessible instance of NodeStore for managing TermletNode data.
 */
export const GlobalNodeStore = new NodeStore();