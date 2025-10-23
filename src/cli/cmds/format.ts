import xml_formatter from "xml-formatter";
import { globSync as glob } from "glob";
import { readFileSync, writeFileSync } from "fs";
import chalk from "chalk";
import { logger } from "../../utils";

export interface FormatCMDOptions {
  write: string;
  indent: string;
  collapse: boolean;
}

export function formatCMD(options: FormatCMDOptions) {
  
  if (!options.write)
    options.write = `**/*.tml`

  if (!options.write.endsWith(".tml"))
    return logger.error(`The write option must end with .tml extension`)

  let indent = parseInt(options.indent);
  if (!isNaN(indent)) indent = 3;

  const files = glob(options.write);

  for (const file of files) {

    const old = performance.now();
    const content = readFileSync(file, "utf-8");
    const formatted = xml_formatter(content, {
      collapseContent: options.collapse,
      indentation: ` `.repeat(indent)
    });

    writeFileSync(file, formatted);
    const now = performance.now();
    const ms = Math.round((now - old));
    let time = ms;

    if (ms > 1000) {
      time = ms / 1000
    } 

    logger.point(`${file} (${ms}ms)`);

  }
}