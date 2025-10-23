import { TermletNode } from "../../src/renderer";

/**
 * Manages Termlet node operations.
 */
export interface TermletNodesManager {
  /**
   * Captures the input answer associated with a specific node ID.
   * @param id - The unique identifier of the node.
   * @returns The captured input answer as a string.
   */
  captureInputAnswer: (id: string) => string;
  /**
   * Tries to find the node by the ID and returns it
   * @param id The unique identifier of the node
   * @returns The node found
   */
  getNodeByID(id: string): TermletNode | undefined
}

/**
 * Represents the global Termlet interface.
 */
export interface TermletInterface {
  /**
   * Provides access to node management utilities.
   */
  Nodes: TermletNodesManager;
}

declare global {
  /**
   * Global Termlet object providing access to core Termlet functionality.
   */
  const Termlet: TermletInterface;

  /**
   * Prints a message to the output stream.
   * @param message - The main message to print.
   * @param optionalParameters - Additional strings to include in the output.
   */
  function print(message: string, ...optionalParameters: string[]): void;
}