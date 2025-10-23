/**
 * A type-safe key-value store for managing V data.
 * Keys are strings and values are V instances.
 */
export class Store<V> {
  private store: Map<string, V> = new Map();

  constructor() {}

  /**
   * Stores a V under the specified key.
   * @param key - The key to associate with the value.
   * @param value - The V to store.
   */
  set(key: string, value: V): void {
    this.store.set(key, value);
  }

  /**
   * Retrieves the V associated with a key.
   * @param key - The key to retrieve.
   * @returns The V if found, otherwise undefined.
   */
  get(key: string): V | undefined {
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
   * Removes a key and its associated V from the store.
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
   * Lists all V values currently stored.
   * @returns An array of V values.
   */
  values(): V[] {
    return Array.from(this.store.values());
  }

  /**
   * Lists all entries as [key, V] pairs.
   * @returns An array of key-value tuples.
   */
  entries(): [string, V][] {
    return Array.from(this.store.entries());
  }

  /**
   * Converts the store to a plain object.
   * @returns An object mapping keys to V values.
   */
  toObject(): Record<string, V> {
    const obj: Record<string, V> = {};
    for (const [key, value] of this.store.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Loads key-V pairs from a plain object into the store.
   * @param obj - The object to load from.
   */
  fromObject(obj: Record<string, V>): void {
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
 * A globally accessible instance of NodeStore for managing V data.
 */
export const GlobalNodeStore = new Store();