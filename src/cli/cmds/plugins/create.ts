import { writeFileSync } from "fs";
import path from "path";
import { getTermletDirectory, logger } from "../../../utils";

const pluginText = `import { TermletPlugin, TermletPluginData } from "termlet.js";

export default class TestPlugin extends TermletPlugin {

  metadata(): TermletPluginData {
    return {
      name: "$name",
      version: "1.0.0",
      description: "Your very own plugin",
      authors: ["Example Author"],
      dependencies: [],
    }
  }

  async load(): Promise<void> {
    // The load sequence here
  }
  
  async stop(): Promise<void> {
    // The stop sequence here
  }
}`;

export function createPluginCMD(...args: any[]) {
  const [name] = args;
  const f = path.join(getTermletDirectory(), "plugins", `${name}.ts`);

  logger.point(`termlet/plugins/${name}.ts`);

  writeFileSync(
    f,
    pluginText.replaceAll(`$name`, name)
  );

  logger.info("Successfully created a new plugin for your project!");
}
