import chalk from "chalk";
import boxen from "boxen";
import * as Boxen from "boxen";

export type LogType = "INFO" | "WARN" | "ERROR" | "DEBUG";

export class Logger {
  private wtype: string = "on";

  log(type: LogType, message: string) {
    const typeColor = this.getTypeColor(type);
    const pipe = chalk.gray("|");
    console.log(`${typeColor(type)} ${pipe} ${message}`);
  }

  info(message: string) {
    this.log("INFO", message);
  }

  warn(message: string) {
    if (this.wtype === "ignore") return;
    this.log("WARN", message);
  }

  error(message: string) {
    this.log("ERROR", message);
  }

  debug(message: string) {
    this.log("DEBUG", message);
  }

  box(message: string, type: LogType = "INFO") {
    const typeColor = this.getTypeColor(type);
    const boxed = boxen(`${typeColor(type)} ${chalk.gray("|")} ${message}`, {
      padding: 1,
      borderColor: this.getBoxColor(type),
      borderStyle: "round",
    });
    console.log(boxed);
  }

  point(message: string) {
    console.log(
      chalk.green(`[+]`) +
        ` ${chalk.greenBright(`${message}`)}`
    );
  }

  private getTypeColor(type: LogType): (text: string) => string {
    switch (type) {
      case "INFO":
        return chalk.blue;
      case "WARN":
        return chalk.yellow;
      case "ERROR":
        return chalk.red;
      case "DEBUG":
        return chalk.magenta;
      default:
        return chalk.white;
    }
  }

  warningsType(name: string) {
    this.wtype = name;
    return this;
  }

  private getBoxColor(type: LogType): string {
    switch (type) {
      case "INFO":
        return "blue";
      case "WARN":
        return "yellow";
      case "ERROR":
        return "red";
      case "DEBUG":
        return "magenta";
      default:
        return "white";
    }
  }
}

export const logger = new Logger();
