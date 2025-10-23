import boxen from "boxen";
import { TermletNode, NodeName } from "../../renderer";
import { BaseComponent } from "../base";

export class BoxedComponent extends BaseComponent {
  
  async renderComponent(node: TermletNode): Promise<void> {

    const { title, color, title_alignment } = node.getMultipleAttributes("title", "color", "title_alignment");

    if (title)
      this.validateAttributeType(title, "string", "Title value must be a string");

    if (color)
      this.validateAttributeType(color, "string", "Color value must be a string");

    if (title_alignment)
      this.validateAttributeType(title_alignment, "string", "Color value must be a string");

    const titleValue = title?.value as string | undefined;
    const colorValue = color?.value as string | undefined;
    const titleAlignmentValue = title_alignment?.value as "left" | "right" | "center" | undefined;

    if (titleAlignmentValue && !["left", "right", "center"].includes(titleAlignmentValue))
      throw new Error("Title Alignment for Boxed components must be: left, right or center.");

    if (!node.hasContent())
      throw new Error("The Boxed component must have content!");

    const content = node.content!;

    console.log(boxen(content, {
      title: titleValue,
      padding: 1,
      margin: 1,
      borderColor: colorValue,
      titleAlignment: titleAlignmentValue,
      borderStyle: "round"
    }));

  }

  name(): NodeName {
    return "Boxed";
  }

}