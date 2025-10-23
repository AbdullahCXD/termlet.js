import { readFileSync, existsSync, writeFileSync } from "fs";
import path, { resolve } from "path";
import { parse, stringify } from "yaml";

export const CONFIGURATION_FILE_NAME = "termlet.yml";

/**
 * A key-value configuration store that loads from a YAML file.
 * Supports nested key access using dot notation.
 */
export class TermletConfiguration {
  public static newProject(name: string) {
    writeFileSync(
      path.join(process.cwd(), CONFIGURATION_FILE_NAME),
      stringify({
        project: {
          name,
          version: "1.0.0",
          entry: "main.tml",
        },
      })
    );
  }

  private store: Record<string, unknown> = {};

  constructor() {
    const path = resolve(process.cwd(), CONFIGURATION_FILE_NAME);
    if (!existsSync(path)) {
      throw new Error(
        `Configuration file not found: ${CONFIGURATION_FILE_NAME}`
      );
    }

    const content = readFileSync(path, "utf8");
    this.store = parse(content);
  }

  // Internal utility to resolve nested keys
  private resolvePath<T = unknown>(key: string): T | undefined {
    const parts = key.split(".");
    let current: any = this.store;

    for (const part of parts) {
      if (
        typeof current !== "object" ||
        current === null ||
        !(part in current)
      ) {
        return undefined;
      }
      current = current[part];
    }

    return current as T;
  }

  // Core methods
  set(key: string, value: unknown): void {
    const parts = key.split(".");
    let current: any = this.store;

    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof current[parts[i]] !== "object" || current[parts[i]] === null) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }

  get<T = unknown>(key: string): T | undefined {
    return this.resolvePath<T>(key);
  }

  has(key: string): boolean {
    return this.resolvePath(key) !== undefined;
  }

  delete(key: string): boolean {
    const parts = key.split(".");
    let current: any = this.store;

    for (let i = 0; i < parts.length - 1; i++) {
      if (
        typeof current !== "object" ||
        current === null ||
        !(parts[i] in current)
      ) {
        return false;
      }
      current = current[parts[i]];
    }

    return delete current[parts[parts.length - 1]];
  }

  // Type-safe helpers
  getString(key: string): string | undefined {
    const value = this.get(key);
    return typeof value === "string" ? value : undefined;
  }

  getNumber(key: string): number | undefined {
    const value = this.get(key);
    return typeof value === "number" ? value : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.get(key);
    return typeof value === "boolean" ? value : undefined;
  }

  getArray<T = unknown>(key: string): T[] | undefined {
    const value = this.get(key);
    return Array.isArray(value) ? (value as T[]) : undefined;
  }

  getObject<T = Record<string, unknown>>(key: string): T | undefined {
    const value = this.get(key);
    return typeof value === "object" && !Array.isArray(value) && value !== null
      ? (value as T)
      : undefined;
  }

  keys(): string[] {
    return Object.keys(this.store);
  }

  size(): number {
    return Object.keys(this.store).length;
  }
}
