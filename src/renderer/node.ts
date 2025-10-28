import { GlobalNodeStore } from "../stores/node-store";

export type NodeAttributePrefix = `@_`
export const NODE_ATTRIBUTE_PREFIX: NodeAttributePrefix = `@_`

export type AttributeValue = string | boolean | number | symbol;
export type Attribute = {
  name: string;
  raw_name: `${NodeAttributePrefix}${string}`;
  value: AttributeValue
};

export type NodeName = 
  | "Text"
  | "ColoredText"
  | "Script"
  | "TermletProject"
  | "Header"
  | "Content"
  | "Input"
  | "Component"
  | "Boxed"
  | "Require"  

  | "Meta"
  | "Test"

  | ""

export class TermletNode {
 
  public obj: any;
  public attributes: Attribute[];
  public children: TermletNode[];
  public name: NodeName;
  public file: string;
  public content?: string;
  public parent?: TermletNode

  constructor(obj: any, file: string, name: NodeName, attributes: Attribute[], children: TermletNode[], content?: string, parent?: TermletNode) {
    this.obj = obj;
    this.name = name;
    this.file = file;
    this.attributes = attributes;
    this.children = children;
    this.content = content;
    this.parent = parent;
  }

  getAttributeByName(name: string) {
    return this.attributes.find((v) => v.name === name);
  }

  getChildByName(name: string) {
    return this.children.find((v) => v.name === name);
  }
  
  hasChild(name: string) {
    return this.getChildByName(name) !== undefined;
  }

  hasAttribute(name: string) {
    return this.getAttributeByName(name) !== undefined;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  hasAttributes(): boolean {
    return this.attributes.length > 0
  }

  getMultipleAttributes(...attributes: string[]) {
    const attr: Record<string, Attribute | undefined> = {};

    for (const attrName of attributes) {
      attr[attrName] = this.getAttributeByName(attrName);
    }

    return attr;
  }

  hasContent(): boolean {
    return this.content !== undefined;
  }
}