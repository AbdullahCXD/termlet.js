import * as vm from "vm";
import { captureInputAnswer } from "./context/captures";
import { getNodeById } from "./context/nodes";
import { createFunctionMethod, getFunctionMethod } from "./context/functions";

export function TermletContext(): vm.Context {

  const context: vm.Context = {};

  context.print = (message: string, ...other: string[]) => {
    console.log(message, ...other);
  }

  context.Termlet = {};
  context.Termlet.Terminal = {
    captureInputAnswer,
    getNodeById,
    createFunction: createFunctionMethod,
    getFunction: getFunctionMethod
  }

  context.Terminal = context.Termlet.Terminal;

  return context;
}