import { readFileSync } from "fs";
import * as XML from "fast-xml-parser";
import { Attribute, AttributeValue, NODE_ATTRIBUTE_PREFIX, NodeAttributePrefix, NodeName, TermletNode } from "../renderer";
import { GlobalNodeStore } from "../stores/node-store";
import semver from "semver";

export const TOP_TAG_NAME = "TermletProject"

export class TermletParser {

  private parser: XML.XMLParser = new XML.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: NODE_ATTRIBUTE_PREFIX,
  });

  parse(file: string, content: string) {

    const data = this.parser.parse(content);

    //console.log(JSON.stringify(data, null, 3));

    const node = this.transform(data[TOP_TAG_NAME], file, TOP_TAG_NAME as NodeName, data[TOP_TAG_NAME]);

    this.registerIntoNodeStore(node);

    return node;

  }

  registerIntoNodeStore(node: TermletNode) {
    if (node.hasAttribute("id")) {
      const attr = node.getAttributeByName("id")!;
      if (typeof attr.value !== "string")
        throw new Error(`Id in the Termlet node must be a string!`);
      GlobalNodeStore.set(attr.value, node);
    }

    if (node.hasChildren()) {
      for (const child of node.children) {
        this.registerIntoNodeStore(child);
      }
    }
  }

  parseFile(fileName: string) {
    return this.parse(fileName, readFileSync(fileName, "utf-8"));
  }

  transform(obj: any, file: string, name: NodeName, parent?: TermletNode): TermletNode {
    if (typeof obj === "string") {
      return new TermletNode(obj, file, name, [], [], obj, parent);
    }

    const children: TermletNode[] = [];
    const attributes: Attribute[] = [];
    let content: string | undefined = undefined;

    for (const [raw_name, value] of Object.entries(obj)) {
      if (raw_name.startsWith(NODE_ATTRIBUTE_PREFIX)) {
        const [_, ...other] = raw_name.split(NODE_ATTRIBUTE_PREFIX);
        const attrKey = other.join("");

        attributes.push({
          name: attrKey,
          raw_name: raw_name as NodeAttributePrefix,
          value: this.parseAttributeValue(value),
        });
      } else if (raw_name === "#text") {
        content = value as string;
      }
    }

    const node = new TermletNode(obj, file, name, attributes, [], content, parent);

    for (const [raw_name, value] of Object.entries(obj)) {
      if (!raw_name.startsWith(NODE_ATTRIBUTE_PREFIX) && raw_name !== "#text") {

        if (Array.isArray(value)) {
          for (const item of value) {
            const child = this.transform(item, file, raw_name as NodeName, node);
            node.children.push(child);
          }
        } else if (typeof value === "string") {
          if (value.length > 0) {
            // Treat string as a self-closing node
            const child = new TermletNode({}, file, raw_name as NodeName, [], [], value, node);
            node.children.push(child);
          } else {
            // Treat empty string as a self-closing node
            const child = new TermletNode({}, file, raw_name as NodeName, [], [], undefined, node);
            node.children.push(child);
          }
        } else {
          const child = this.transform(value, file, raw_name as NodeName, node);
          node.children.push(child);
        }
      }
    }

    return node;
  }

  parseAttributeValue(value: any): AttributeValue {
    if (value === "true" || value === "false")
      return Boolean(value);

    if (semver.valid(value))
      return value

    if (!isNaN(parseInt(value)))
      return parseInt(value);

    return value;
  }
}