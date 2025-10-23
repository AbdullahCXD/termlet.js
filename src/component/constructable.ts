import { NodeName, TermletNode } from "../renderer";
import { BaseComponent } from "./base";

export type ConstructableRenderMethod = (node: TermletNode) => Promise<void>;

export class ConstructableComponent extends BaseComponent {

  constructor(private cname: NodeName, private render: ConstructableRenderMethod) {
    super();
  }

  name(): NodeName {
    return this.cname
  }

  async renderComponent(node: TermletNode): Promise<void> {
    await this.render(node);
  }
  
}