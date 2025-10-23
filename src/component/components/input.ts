import { Attribute, NodeName, TermletNode } from "../../renderer";
import { GlobalCaptureStore } from "../../stores";
import { BaseComponent } from "../base";
import inquirer from "inquirer";

export class InputComponent extends BaseComponent {
  async renderComponent(node: TermletNode): Promise<void> {
    
    const { type, id } = node.getMultipleAttributes("type", "id");

    if (!type || !id)
      throw new Error(`Type or ID must be available for this Input tag!`);

    if (!node.hasContent())
      throw new Error(`Text content must be available for this Input tag!`);

    this.validateAttributeType(type, "string", "Type must be a string value")
    this.validateAttributeType(id, "string", "ID must be a string value!");


    const content = node.content!;

    switch (type.value as string) {
      case "text":
        await this.runTextInput(type, id, content);
        break;

      default:
        throw new Error("This input type is invalid!");
      
    }
  }

  async runTextInput(type: Attribute, id: Attribute, content: string) {

    const { answer } = await inquirer.prompt(
      [
        {
          name: "answer",
          type: "input",
          message: content,
        }
      ]
    );

    // set into the capture store

    GlobalCaptureStore.set(`input-capture-${id.value as string}`, answer);

  }

  name(): NodeName {
    return "Input";
  }
}