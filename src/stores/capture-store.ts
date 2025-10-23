/**
 * A generic key-value store for capturing and managing data.
 * Keys are strings and values can be of any type.
 */
export class CaptureStore {
  private store: Map<string, any> = new Map();

  constructor() {}

  /**
   * Sets a key-value pair in the store.
   * @param key - The key to set.
   * @param value - The value to associate with the key.
   */
  set(key: string, value: any): void {
    this.store.set(key, value);
  }

  /**
   * Retrieves the value associated with a given key.
   * @param key - The key to look up.
   * @returns The value if found, otherwise undefined.
   */
  get(key: string): any | undefined {
    return this.store.get(key);
  }

  /**
   * Checks whether a given key exists in the store.
   * @param key - The key to check.
   * @returns True if the key exists, false otherwise.
   */
  has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Deletes a key-value pair from the store.
   * @param key - The key to delete.
   * @returns True if the key was deleted, false if it did not exist.
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clears all entries from the store.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Returns an array of all keys in the store.
   * @returns An array of keys.
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Returns an array of all values in the store.
   * @returns An array of values.
   */
  values(): any[] {
    return Array.from(this.store.values());
  }

  /**
   * Returns all entries in the store as an array of [key, value] tuples.
   * @returns An array of key-value pairs.
   */
  entries(): [string, any][] {
    return Array.from(this.store.entries());
  }

  /**
   * Converts the store to a plain JavaScript object.
   * @returns An object representation of the store.
   */
  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const [key, value] of this.store.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Loads key-value pairs from a plain JavaScript object into the store.
   * @param obj - The object to load from.
   */
  fromObject(obj: Record<string, any>): void {
    for (const [key, value] of Object.entries(obj)) {
      this.set(key, value);
    }
  }

  /**
   * Returns the number of entries in the store.
   * @returns The size of the store.
   */
  size(): number {
    return this.store.size;
  }
}

/**
 * A globally accessible instance of CaptureStore.
 */
export const GlobalCaptureStore = new CaptureStore();