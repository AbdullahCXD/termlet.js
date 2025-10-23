export type Defaultable<T> = { default: T }
export type Class<T> = new (...args: any[]) => T
export type Require<T> = Defaultable<T> | T

export function indent(length: number): string {
  return ` `.repeat(length);
}

export function wait(time: number): Promise<void> {
  return new Promise((res, rej) => {
    setTimeout(() => res(), time);
  });
}

export function parseBoolean(text: string) {
  if (text === "true") return true;
  else if (text === "false") return false;
  else return text;
}

export * from "./logger";
export * from "./files";