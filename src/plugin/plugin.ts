import { CommandConfig, CommandManager } from "../cli/commands";

export interface TermletPluginData {
  name: string;
  version: string;
  description?: string;
  authors: string[];
  dependencies: string[];
}

export abstract class TermletPlugin {

  private commandManager!: CommandManager;

  public abstract metadata(): TermletPluginData;

  public abstract load(): Promise<void>;
  public abstract stop(): Promise<void>;

  public createCommand(commandConfig: CommandConfig) {
    return this.commandManager.register(commandConfig);
  }

  public context(cmdManager: CommandManager) {
    this.commandManager = cmdManager;
    return this;
  }

}