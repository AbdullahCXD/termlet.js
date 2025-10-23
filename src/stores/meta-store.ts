import { ComponentRegistry } from "../component/registry";
import { logger, parseBoolean } from "../utils";

type MetaAction = (key: string, value: string | boolean | number | symbol) => boolean;

export class MetaStore {
  private store: Map<string, string | boolean | number | symbol> = new Map();
  private actions: Map<string, MetaAction> = new Map();

  constructor() {
    this.onSet("terminal.title", (key, value) => {
      process.title = value as string;
      return true;
    });
    this.onSet("language.warnings", (key, value) => {
      logger.warningsType(value as string);
      return true;
    });
    this.onSet("terminal.log", (key, value) => {
      let val = parseBoolean(value as string);

      if (typeof val !== "boolean") return false;

      ComponentRegistry.log = val;

      return true;
    });
  }

  // Set a key-value pair, running any pre-set action
  set(key: string, value: string | boolean | number | symbol): void {
    const action = this.actions.get(key);
    if (action) {
      const result = action(key, value);
      if (!result) return;
    }
    this.store.set(key, value);
  }

  // Get a value by key
  get(key: string): string | boolean | number | symbol | undefined {
    return this.store.get(key);
  }

  // Check if a key exists
  has(key: string): boolean {
    return this.store.has(key);
  }

  // Delete a key
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  // Clear all entries
  clear(): void {
    this.store.clear();
  }

  // Register an action for a specific key
  onSet(key: string, action: MetaAction): void {
    this.actions.set(key, action);
  }

  // Remove an action for a key
  removeAction(key: string): void {
    this.actions.delete(key);
  }

  // Get all keys
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  // Get all values
  values(): (string | boolean | number | symbol)[] {
    return Array.from(this.store.values());
  }

  // Get all entries
  entries(): [string, string | boolean | number | symbol][] {
    return Array.from(this.store.entries());
  }

  // Convert to plain object
  toObject(): Record<string, string | boolean | number | symbol> {
    const obj: Record<string, string | boolean | number | symbol> = {};
    for (const [key, value] of this.store.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // Load from plain object
  fromObject(obj: Record<string, string>): void {
    for (const [key, value] of Object.entries(obj)) {
      this.set(key, value);
    }
  }

  // Size of the store
  size(): number {
    return this.store.size;
  }
}

export const GlobalMetaStore = new MetaStore();