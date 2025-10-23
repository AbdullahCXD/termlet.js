import { GlobalMetaStore } from "../../stores";
import { NodeName, TermletNode } from "../../renderer";
import { BaseComponent } from "../base";

export class MetaComponent extends BaseComponent {

  name(): NodeName {
    return "Meta";
  }

  async renderComponent(node: TermletNode): Promise<void> {
    
    if (!node.parent || node.parent.name !== "Header")
      throw new Error("Meta tags can only be used in the Header component!");

    const key = node.getAttributeByName("key");
    const value = node.getAttributeByName("value");

    if (!key || !value)
      throw new Error("Meta tags must have key and value attributes!"); 

    const kValue = this.validateAttributeType<string>(key, "string", "Meta tags must have key string attributes");

    GlobalMetaStore.set(kValue, value.value!);

  }

}