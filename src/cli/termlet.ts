#!/bin/env node

import { CommandBuilder, commander_program, manager } from "./commands";
import { createCMD } from "./cmds/create";
import { startCMD } from "./cmds/start";
import { versionCMD } from "./cmds/version";
import { renderer_listCMD } from "./cmds/renderer/list";
import { renderer_infoCMD } from "./cmds/renderer/info";
import { formatCMD, FormatCMDOptions } from "./cmds/format";
import { PluginManager } from "../plugin/manager";
import { mkdirSync } from "fs";
import { getTermletDirectory } from "../utils";
import { createPluginCMD } from "./cmds/plugins/create";

mkdirSync(getTermletDirectory(), { recursive: true });

const pluginManager = new PluginManager(manager);

// Register create command
manager.register(
  CommandBuilder.create("create")
    .description("Create a new Termlet project")
    .argument({
      name: "name",
      description: "Project name",
      required: true,
    })
    .action((name: string) => {
      createCMD(name);
    })
    .build()
);

// Register run command
manager.register(
  CommandBuilder.create("run")
    .description("Run a Termlet file")
    .argument({
      name: "entry",
      description: "Optional entry name to start a custom Termlet file",
      required: false,
    })
    .action((entry?: string) => {
      startCMD(entry);
    })
    .build()
);

// Register renderer command with subcommands
manager.register({
  name: "renderer",
  description: "Renderer Management",
  action: () => {
    // Show help if no subcommand provided
    commander_program.commands.find((cmd) => cmd.name() === "renderer")?.help();
  },
  subcommands: [
    {
      name: "list",
      description: "Lists all available renderer's",
      action: () => {
        renderer_listCMD();
      },
    },
    {
      name: "info",
      description: "Displays information about a renderer",
      arguments: [
        {
          name: "renderer",
          description: "The renderer to show info about",
          required: true,
        },
      ],
      action: (renderer: string) => {
        renderer_infoCMD(renderer);
      },
    },
  ],
});

// Register format command
manager.register(
  CommandBuilder.create("format")
    .description("Formats all of the XML files based on a set path")
    .option({
      flags: "-w, --write <path>",
      description: "The main path to search in and format",
    })
    .option({
      flags: "-i, --indent <length>",
      description: "The length of the indentation",
      defaultValue: "3",
    })
    .option({
      flags: "-c, --collapse",
      description: "Used with the formatter to collapse the content",
      defaultValue: false,
    })
    .action(async (options: FormatCMDOptions) => {
      await formatCMD(options);
    })
    .build()
);

// Register version command
manager.register(
  CommandBuilder.create("version")
    .description("Display Termlet version")
    .action(() => {
      versionCMD();
    })
    .build()
);

manager.register({
  name: "plugins",
  description: "The main plugin system for Termlet",
  action: () => {
    // Show help if no subcommand provided
    commander_program.commands.find((cmd) => cmd.name() === "plugins")?.help();
  },
  subcommands: [
    {
      name: "list",
      description: "Loads and lists all the plugins",
      action: () => {
        pluginManager.listPlugins();
      },
    },
    {
      name: "create",
      description: "The way to create plugins",
      arguments: [
        {
          name: "name",
          description: "The plugin name to create",
          required: true,
        },
      ],
      action: (...args) => {
        createPluginCMD(...args);
      },
    },
    {
      name: "info",
      description: "Shows information about a plugin",
      arguments: [
        {
          name: "name",
          description: "The plugin for the information to show",
          required: true,
        },
      ],
      action: (...args) => {
        pluginManager.inspectPlugin(args[0]);
      },
    },
  ],
});

// Example: Load plugins (you can load these from a config file or directory)
async function loadPlugins() {
  await pluginManager.load();
}

// Main execution
async function main() {
  try {
    // Load any plugins before parsing
    await loadPlugins();

    // Parse command line arguments
    commander_program.parse();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Export for external use
export {
  commander_program as TermletCommand,
  manager as commands,
  pluginManager,
};

// Run if called directly
if (require.main === module) {
  main();
}
