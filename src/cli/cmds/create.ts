import { TermletConfiguration } from "../../config";
import { logger } from "../../utils";

export function createCMD(name: string) {

  TermletConfiguration.newProject(name);
  logger.info(`Created Termlet project successfully at ${process.cwd()}`);

}