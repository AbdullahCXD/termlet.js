import { TermletPlugin, TermletPluginData } from "../..";

export default class TestPlugin extends TermletPlugin {

  metadata(): TermletPluginData {
    return {
      name: "TestPlugin",
      version: "1.0.0",
      description: "Your very own plugin",
      authors: ["Example Author"],
      dependencies: ["another-plugin"],
    }
  }

  async load(): Promise<void> {

  }
  
  async stop(): Promise<void> {

  }
}