import { TermletParser } from "../parser";
import { TermletNode } from "./node";

export interface RendererContext {
  node: TermletNode;
}

export const enum ValidationResultEnum {
  AnalysisError = "AnalysisError",
  Success = "Success"
}

export interface ValidationResult {
  type: ValidationResultEnum,
  message: string;
  metadata?: any;
  node: TermletNode;
}

export interface Version {
  value: string;
  deprecated?: boolean;
}

export interface IRenderer {

  render(context: RendererContext): Promise<void>;
  renderComponents(node: TermletNode): Promise<void>;
  description(): string;
  authors(): string[];
  validate(node: TermletNode): Promise<ValidationResult>;
  name(): string;
  version(): Version[];
  
}