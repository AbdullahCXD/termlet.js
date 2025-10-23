import { TermletPlugin, TermletPluginData } from "../..";

export default class TestPlugin extends TermletPlugin {

  metadata(): TermletPluginData {
    return {
      name: "another-plugin",
      version: "1.0.0",
      description: "Your very own plugin",
      authors: ["Example Author"],
      dependencies: [],
    }
  }

  async load(): Promise<void> {

  }
  
  async stop(): Promise<void> {

  }
}