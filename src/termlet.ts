import { existsSync } from "fs";
import { ComponentRegistry } from "./component/registry";
import { TermletParser } from "./parser";
import { RendererRegistry } from "./renderer";
import { logger } from "./utils";

export const globalParser = new TermletParser();

export class Termlet {
  constructor() {
    RendererRegistry.registerAll();
    ComponentRegistry.registerAll();
  }

  async termlet(file: string) {
    try {
      if (!existsSync(file))
        return logger.error(
          "The file provided doesn't exist, please ensure the file exists before running this command!"
        );
      const data = globalParser.parseFile(file);

      await RendererRegistry.render(globalParser, data);
    } catch (err) {
      logger.error(
        `An error occured during runtime, please review the error below and fix your issues.`
      );
      const lines = (err as Error).toString().split("\n");
      lines.forEach((v) => logger.error(v));
    }
  }
}
