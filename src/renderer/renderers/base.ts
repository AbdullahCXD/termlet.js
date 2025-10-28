import { ComponentRegistry } from "../../component/registry";
import { TermletNode } from "../node";
import {
  IRenderer,
  RendererContext,
  ValidationResult,
  ValidationResultEnum,
  Version,
} from "../renderer";

export class TermletBase implements IRenderer {
  name(): string {
    return "termlet.base";
  }

  version(): Version[] {
    return [
      {
        value: "1.0.0",
        deprecated: true,
      },
      {
        value: "1.0.1",
        deprecated: true
      },
      {
        value: "2.0.0",
        deprecated: false
      },
      {
        value: "2.0.1",
        deprecated: false
      }
    ];
  }

  description(): string {
    return "The main renderer provided by the Termlet Team which is designed to be defaultly used by the whole language"
  }

  authors(): string[] {
    return ["AbdullahCXD"]
  }

  async validate(node: TermletNode): Promise<ValidationResult> {
    if (["Component", "Require"].includes(node.name)) {
      await ComponentRegistry.render(this, node);
      return {
        type: ValidationResultEnum.Success,
        message: "Valid Component",
        node,
      };
    }

    if (["Header", "Content", "TermletProject"].includes(node.name))
      return {
        type: ValidationResultEnum.Success,
        message: "Valid Component",
        node,
      };

    if (!ComponentRegistry.isValidComponent(node)) {
      return {
        type: ValidationResultEnum.AnalysisError,
        message: `Invalid node component`,
        node,
      };
    }

    return {
      type: ValidationResultEnum.Success,
      message: "Valid Component",
      node,
    };
  }

  async render(context: RendererContext): Promise<void> {
    const node = context.node;
    const header = node.getChildByName("Header");
    const content = node.getChildByName("Content");

    if (header && header.hasChildren()) {
      for (const child of header.children) {
        await this.renderHeaderComponents(child);
      }
    }

    if (content && content.hasChildren()) {
      for (const child of content.children) {
        await this.renderComponents(child);
      }
    }
  }

  async renderHeaderComponents(node: TermletNode) {
    await ComponentRegistry.render(this, node);
  }

  async renderComponents(node: TermletNode) {
    await ComponentRegistry.render(this, node);

    if (node.name !== "Component" && node.hasChildren()) {
      for (const child of node.children) {
        await this.renderComponents(child);
      }
    }
  }
}
