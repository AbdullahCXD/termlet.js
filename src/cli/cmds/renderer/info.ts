import chalk from "chalk";
import boxen from "boxen";
import { RendererRegistry } from "../../../renderer";

export function renderer_infoCMD(rendererName: string) {
  RendererRegistry.registerAll();

  const reg = RendererRegistry.REGISTRY;
  const renderer = reg.get(rendererName);

  if (!renderer) {
    console.log(
      boxen(
        `${chalk.red("ERR")} ${chalk.bold("Renderer not found")}\n\n${chalk.dim(
          `No renderer named "${rendererName}" exists.`
        )}`,
        {
          padding: 1,
          borderStyle: "round",
          borderColor: "red",
        }
      )
    );
    return;
  }

  const versions = renderer.version();
  const description = renderer.description?.() || "No description available";
  const authors = renderer.authors?.() || [];
  
  // Build version list
  const versionList = versions
    .map((v) => {
      const status = v.deprecated
        ? chalk.red(" DEPRECATED")
        : chalk.green(" Active");
      return `  ${chalk.gray("•")} ${chalk.whiteBright(
        v.value
      )} ${chalk.dim("─")} ${status}`;
    })
    .join("\n");

  // Build metadata
  const metadata: string[] = [];
  
  if (versions.length > 0) {
    metadata.push(`${chalk.dim("Total Versions:")} ${chalk.white(versions.length)}`);
    
    const activeCount = versions.filter(v => !v.deprecated).length;
    const deprecatedCount = versions.filter(v => v.deprecated).length;
    
    if (activeCount > 0) {
      metadata.push(`${chalk.dim("Active:")} ${chalk.green(activeCount)}`);
    }
    if (deprecatedCount > 0) {
      metadata.push(`${chalk.dim("Deprecated:")} ${chalk.red(deprecatedCount)}`);
    }
  }

  // Build authors list
  const authorsList = authors.length > 0
    ? authors.map(author => `  ${chalk.gray("•")} ${chalk.white(author)}`).join("\n")
    : `  ${chalk.dim("No authors listed")}`;

  const content = [
    `${chalk.bold.cyan(rendererName)}`,
    "",
    chalk.bold.underline("Description:"),
    `  ${chalk.white(description)}`,
    "",
    chalk.bold.underline("Authors:"),
    authorsList,
    "",
    chalk.bold.underline("Versions:"),
    versionList,
    "",
    chalk.bold.underline("Summary:"),
    `  ${metadata.join(` ${chalk.dim("│")} `)}`,
  ].join("\n");

  console.log(
    boxen(content, {
      padding: 1,
      margin: { top: 0, right: 0, bottom: 1, left: 0 },
      borderStyle: "round",
      borderColor: "cyan",
      title: "Renderer Info",
      titleAlignment: "center",
    })
  );
}