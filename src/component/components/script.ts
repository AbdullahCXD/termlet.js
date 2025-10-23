import { TermletInstance } from "../../config/instance";
import { NodeName, TermletNode } from "../../renderer";
import { BaseComponent } from "../base";

export class ScriptComponent extends BaseComponent {
  async renderComponent(node: TermletNode): Promise<void> {
    
    const { type, path } = node.getMultipleAttributes("type", "path");

    if (!type || !path)
      throw new Error(`Type or Path must be available for this Script tag!`);

    const typeValue = this.validateAttributeType<string>(type, "string", "Type must be a string value")
    const pathValue = this.validateAttributeType<string>(path, "string", "Path must be a string value!");

    const types: string[] = ["javascript", "typescript"];

    if (!types.includes(typeValue))
      throw new Error(`Invalid type ${typeValue}, must be one of: ${types.join(", ")}`);

    await TermletInstance.create(typeValue, pathValue).run();

  }

  name(): NodeName {
    return "Script";
  }
}