import { Attribute, IRenderer, NodeName, TermletNode } from "../renderer";

export abstract class BaseComponent {

  public renderer!: IRenderer;

  abstract renderComponent(node: TermletNode): Promise<void>;
  abstract name(): NodeName;

  validateAttributeType<T>(attribute: Attribute, validationType: "string" | "number" | "boolean", message: string) {
    if (typeof attribute.value !== validationType)
      throw new Error(message);

    return attribute.value as T
  }

  setRenderer(renderer: IRenderer) {
    this.renderer = renderer;
    return this;
  }
}