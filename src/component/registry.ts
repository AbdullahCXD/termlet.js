import { IRenderer, NodeName, TermletNode } from "../renderer";
import { BaseComponent } from "./base";
import {
  TextComponent,
  BoxedComponent,
  ColoredTextComponent,
  InputComponent,
  MetaComponent,
  ScriptComponent,
  Component,
  RequireComponent,
} from "./components";

export class ComponentRegistry {
  public static REGISTRY: Map<NodeName, BaseComponent> = new Map();
  public static log: boolean = true;

  public static getRenderer(name: NodeName): BaseComponent | undefined {
    return this.REGISTRY.get(name);
  }

  public static register(renderer: BaseComponent) {
    this.REGISTRY.set(renderer.name(), renderer);

    return true;
  }

  public static isValidComponent(node: TermletNode) {
    return this.getRenderer(node.name) !== undefined;
  }

  public static canLog() {
    return this.log;
  }

  public static registerAll() {
    this.register(new TextComponent());
    this.register(new MetaComponent());
    this.register(new InputComponent());
    this.register(new ScriptComponent());
    this.register(new BoxedComponent());
    this.register(new ColoredTextComponent());
    this.register(new Component());
    this.register(new RequireComponent());
  }

  public static async render(renderer: IRenderer, node: TermletNode) {
    const name = node.name;
    const component = this.getRenderer(name);

    if (!component)
      throw new Error(
        `Invalid component with name of ${name}, please rewrite to a valid component!`
      );

    component.setRenderer(renderer);
    await component.renderComponent(node);
  }
}
