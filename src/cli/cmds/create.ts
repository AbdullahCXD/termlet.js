import { execSync } from "child_process";
import { TermletConfiguration } from "../../config";
import { logger } from "../../utils";
import chalk from "chalk";

export function createCMD(name: string) {

  TermletConfiguration.newProject(name);

  console.log(chalk.green(`[+]`) + ` ${chalk.greenBright(`npm install termlet.js@latest`)}`)

  execSync("npm install termlet.js@latest", {
    cwd: process.cwd(),
    encoding: "utf-8",
    env: process.env,
    stdio: "ignore"
  })

  logger.info(`Created Termlet project successfully at ${process.cwd()}`);

}