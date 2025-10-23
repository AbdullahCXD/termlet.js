// commands.ts
import { Command, Argument, Option } from "commander";

export interface CommandArgument {
  name: string;
  description: string;
  required?: boolean;
  variadic?: boolean;
  defaultValue?: any;
}

export interface CommandOption {
  flags: string;
  description: string;
  defaultValue?: any;
  choices?: string[];
}

export interface CommandConfig {
  name: string;
  description: string;
  arguments?: CommandArgument[];
  options?: CommandOption[];
  action: (...args: any[]) => void | Promise<void>;
  subcommands?: CommandConfig[];
}

export class CommandBuilder {
  private config: Partial<CommandConfig> = {};

  static create(name: string): CommandBuilder {
    const builder = new CommandBuilder();
    builder.config.name = name;
    return builder;
  }

  description(desc: string): this {
    this.config.description = desc;
    return this;
  }

  argument(arg: CommandArgument): this {
    if (!this.config.arguments) {
      this.config.arguments = [];
    }
    this.config.arguments.push(arg);
    return this;
  }

  option(opt: CommandOption): this {
    if (!this.config.options) {
      this.config.options = [];
    }
    this.config.options.push(opt);
    return this;
  }

  action(handler: (...args: any[]) => void | Promise<void>): this {
    this.config.action = handler;
    return this;
  }

  subcommand(subcmd: CommandConfig): this {
    if (!this.config.subcommands) {
      this.config.subcommands = [];
    }
    this.config.subcommands.push(subcmd);
    return this;
  }

  build(): CommandConfig {
    if (!this.config.name || !this.config.action) {
      throw new Error("Command must have a name and action");
    }
    return this.config as CommandConfig;
  }
}

export class CommandManager {
  private program: Command;
  private registeredCommands: Map<string, Command> = new Map();

  constructor(program: Command) {
    this.program = program;
  }

  /**
   * Register a command configuration with Commander
   */
  register(config: CommandConfig): Command {
    const cmd = this.createCommand(config);
    this.registeredCommands.set(config.name, cmd);
    return cmd;
  }

  /**
   * Create a Commander command from configuration
   */
  private createCommand(config: CommandConfig): Command {
    const cmd = new Command(config.name);

    if (config.description) {
      cmd.description(config.description);
    }

    // Add arguments
    if (config.arguments) {
      for (const arg of config.arguments) {
        const argument = new Argument(
          this.formatArgumentName(arg),
          arg.description
        );

        if (arg.defaultValue !== undefined) {
          argument.default(arg.defaultValue);
        }

        cmd.addArgument(argument);
      }
    }

    // Add options
    if (config.options) {
      for (const opt of config.options) {
        const option = new Option(opt.flags, opt.description);

        if (opt.defaultValue !== undefined) {
          option.default(opt.defaultValue);
        }

        if (opt.choices) {
          option.choices(opt.choices);
        }

        cmd.addOption(option);
      }
    }

    // Add action
    if (config.action) {
      cmd.action(config.action);
    }

    // Add subcommands recursively
    if (config.subcommands) {
      for (const subconfig of config.subcommands) {
        const subcmd = cmd
          .command(subconfig.name)
          .description(subconfig.description);

        if (subconfig.arguments) {
          for (const arg of subconfig.arguments) {
            subcmd.argument(arg.required ? `<${arg.name}>` : `[${arg.name}]`, arg.description, arg.defaultValue);
          }
        }

        if (subconfig.options) {
          for (const option of subconfig.options) {
            subcmd.option(option.flags, option.description, option.defaultValue);
          }
        }

        subcmd.action((...args) => subconfig.action(...args))
      }
    }

    // Add to parent program if this is a root command
    if (!config.subcommands || config.subcommands.length === 0) {
      this.program.addCommand(cmd);
    } else {
      this.program.addCommand(cmd);
    }

    return cmd;
  }

  /**
   * Format argument name based on requirements
   */
  private formatArgumentName(arg: CommandArgument): string {
    let name = arg.name;

    if (arg.variadic) {
      name = `${name}...`;
    }

    if (arg.required === false) {
      return `[${name}]`;
    }

    return `<${name}>`;
  }

  /**
   * Get a registered command by name
   */
  getCommand(name: string): Command | undefined {
    return this.registeredCommands.get(name);
  }

  /**
   * Quick helper to create and register a simple command
   */
  static createCommand(
    program: Command,
    name: string,
    description: string,
    args: CommandArgument[],
    options: CommandOption[],
    action: (...args: any[]) => void | Promise<void>
  ): Command {
    const commands = new CommandManager(program);
    const config: CommandConfig = {
      name,
      description,
      arguments: args,
      options,
      action,
    };
    return commands.register(config);
  }
}

export const commander_program = new Command();
commander_program
  .name("termlet")
  .description(
    "Lightweight markup language designed for building terminal-based projects"
  );
export const manager = new CommandManager(commander_program);
