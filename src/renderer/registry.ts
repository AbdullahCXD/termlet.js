import chalk from "chalk";
import { TermletParser } from "../parser";
import { indent, logger } from "../utils";
import { TermletNode } from "./node";
import { IRenderer, ValidationResult, ValidationResultEnum } from "./renderer";
import { TermletBase } from "./renderers";

export class RendererRegistry {

  public static REGISTRY: Map<string, IRenderer> = new Map();

  public static getRenderer(name: string): IRenderer | undefined {
    return this.REGISTRY.get(name);
  }

  public static register(renderer: IRenderer) {
    this.REGISTRY.set(renderer.name(), renderer);

    return true;
  }

  public static registerAll() {

    this.register(new TermletBase());

  }

  public static async render(parser: TermletParser, node: TermletNode) {

    // node is the root node which will get handled later on after these checks by the renderer itself

    const type = node.getAttributeByName("renderer");
    const version = node.getAttributeByName("version"); // Only used if the renderer is deprecated or not to notify the user with a warning

    if (!type || !version || typeof type.value !== "string" || typeof version.value !== "string")
        throw new Error(`No type or version was provided in the document or the values provided in type or versions aren't strings!`);

    const renderer = this.getRenderer(type.value);

    if (!renderer)
      throw new Error(`Invalid renderer by name of ${type.value}, please use \`termlet renderer list\` to know the current registered renderers!`);

    const rendererVer = renderer.version().find((v) => v.value === version.value);

    if (!rendererVer)
      throw new Error(`The renderer by name of ${type.value}, doesn't have the version provided. Please use \`termlet renderer list\` to know the versions of the registered renderers!`);
  
    if (rendererVer.deprecated)
      logger.warn(`You are using a deprecated version in this document, renderer ${type.value} with version of ${version.value} is dprecated!`)
  
    const validation = await this.validateNode(renderer, node);

    if (validation.length > 0) {

      for (let i = 0; i < validation.length; i++) {
        const result = validation[i]!;
        const lines = [
          `${chalk.cyanBright("Renderer Analysis")} ${chalk.gray("|")} ${chalk.redBright(result.type)} ${chalk.gray("|")} ${chalk.yellowBright(result.message)}`,
          `${indent(3)}${chalk.gray("at node:")} ${chalk.whiteBright(result.node.name)} ${chalk.gray(`(File: ${node.file}, Validation no: ${i + 1})`)}`,
          `${indent(3)}${chalk.gray("parent:")} ${chalk.whiteBright(result.node.parent ? result.node.parent.name : "Unknown")}`
        ];

        console.log(lines.join("\n"));
        if (i !>= validation.length)
          console.log(" ");
      }

      return;
    }

    await renderer.render({
      node: node,
    });
  }

  public static async validateNode(renderer: IRenderer, node: TermletNode): Promise<ValidationResult[]> {

    const validationResults: ValidationResult[] = [];
    const validated = await renderer.validate(node);

    if (validated.type !== ValidationResultEnum.Success) {
      validationResults.push(validated);
    }

    if (node.hasChildren()) {

      for (const child of node.children) {

        validationResults.push(...(await this.validateNode(renderer, child)))

      }

    }

    return validationResults;

  }

}