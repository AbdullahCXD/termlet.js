import * as vm from "vm";
import { captureInputAnswer } from "./context/captures";
import { getNodeById } from "./context/nodes";

export function TermletContext(): vm.Context {

  const context: vm.Context = {};

  // add Context methods here

  context.print = (message: string, ...other: string[]) => {
    console.log(message, ...other);
  }

  context.Termlet = {};
  context.Termlet.Nodes = {
    captureInputAnswer,
    getNodeById
  }

  return context;
}