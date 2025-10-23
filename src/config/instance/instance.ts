import * as vm from "vm";
import * as Typescript from "typescript";
import { existsSync, readFileSync } from "fs";
import { TermletContext } from "./context";

export class TermletInstance {

  static create(type: string, filePath: string) {
    return new TermletInstance(type, filePath);
  }

  private type: string;
  private filePath: string;

  constructor(type: string, filePath: string) {
    this.type = type;
    this.filePath = filePath;
  }

  async run() {

    try {

      if (!existsSync(this.filePath))
        throw new Error("Instance Error: The instance file doesn't exist!");

      const content = readFileSync(this.filePath, "utf-8");
      let data = content;

      if (this.type === "typescript") {

        data = this.compileTypescript(content);

      }

      const context = TermletContext();

      await vm.runInNewContext(data, context, {
        contextName: `Termlet-${this.filePath}`
      });

    } catch (err) {

      throw new Error(`Instance Error: ${err}`)

    }

  }

  compileTypescript(content: string) {
    return Typescript.transpile(content);
  }
}