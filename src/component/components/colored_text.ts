import chalk, { ChalkInstance } from "chalk";
import { NodeName, TermletNode } from "../../renderer";
import { logger } from "../../utils";
import { BaseComponent } from "../base";
import { ComponentRegistry } from "../registry";

export class ColoredTextComponent extends BaseComponent {
  async renderComponent(node: TermletNode): Promise<void> {

    const color = node.getAttributeByName("color");

    if (!color)
      throw new Error("The color attribute of this component must be defined");

    const value = this.validateAttributeType<string>(color, "string", "The color attribute of this component must be a string");

    logger.warn(`Using the ColoredText component, make sure to use chalk methods such as: greenBright, redBright, ... and not the hex method.`)

    if (node.hasContent() && ComponentRegistry.canLog()) {
      const method = (chalk as any)[value as string];
      console.log(method(node.content));
    }

  }
  
  name(): NodeName {
    return "ColoredText";
  }
}