import chalk from "chalk";
import boxen from "boxen";
import { RendererRegistry } from "../../../renderer";

export function renderer_listCMD() {
  RendererRegistry.registerAll();

  const reg = RendererRegistry.REGISTRY;

  for (const [key, value] of reg.entries()) {
    const versions = value.version().map((v) => 
      `${chalk.gray("→")} ${chalk.dim("v")}${chalk.whiteBright(v.value)}${
        v.deprecated ? ` ${chalk.red(" DEPRECATED")}` : ""
      }`
    ).join("\n");

    const content = `${chalk.bold.cyan(key)}\n\n${versions}`;

    console.log(
      boxen(content, {
        padding: 1,
        margin: { top: 0, right: 0, bottom: 1, left: 0 },
        borderStyle: "round",
        borderColor: "gray",
        dimBorder: true,
      })
    );
  }
}