import { existsSync } from "fs";
import { NodeName, TermletNode } from "../../renderer";
import { BaseComponent } from "../base";
import { MoudleResolution } from "../../module";

export class RequireComponent extends BaseComponent {
  async renderComponent(node: TermletNode): Promise<void> {

    const { path } = node.getMultipleAttributes("path");

    if (!path)
      throw new Error("Path must be defined as an attribute to use this.");

    const value = this.validateAttributeType<string>(path, "string", "Path must be a string value")

    if (!value.endsWith(".tml"))
      throw new Error("The file must end with the Termlet extension for this to work!");

    if (!existsSync(value))
      throw new Error("The path file must exist!");
  
    const mod = MoudleResolution.load(value);
    await mod.execute();
  }
  
  name(): NodeName {
    return "Require";
  }
}