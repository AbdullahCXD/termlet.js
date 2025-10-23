import { NodeName, TermletNode } from "../../renderer";
import { BaseComponent } from "../base";
import { ConstructableComponent } from "../constructable";
import { ComponentRegistry } from "../registry";

export class Component extends BaseComponent {

  name(): NodeName {
    return "Component";
  }

  async renderComponent(node: TermletNode): Promise<void> {
    
    const { name } = node.getMultipleAttributes("name");

    if (!name)
      throw new Error("Name must be defined for the Component component");

    const nameValue = this.validateAttributeType<string>(name, "string", "The attribute of name must be a string");

    const children = node.hasChildren() ? node.children : [];
    
    // make a constructable
    // save the children & content in the constructable
    // then when it's rendered, it uses the IRenderer to render the saved children and content


    const constructable = new ConstructableComponent(nameValue as NodeName, async (node) => {


      for (const child of children) {


        await this.renderer.renderComponents(child);

      }

    });

    ComponentRegistry.register(constructable);

  }
  
}