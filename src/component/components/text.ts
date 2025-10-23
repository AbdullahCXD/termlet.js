import { NodeName, TermletNode } from "../../renderer";
import { BaseComponent } from "../base";
import { ComponentRegistry } from "../registry";

export class TextComponent extends BaseComponent {
  async renderComponent(node: TermletNode): Promise<void> {

    if (node.hasContent() && ComponentRegistry.canLog()) {
      console.log(node.content);
    }

  }
  
  name(): NodeName {
    return "Text";
  }
}