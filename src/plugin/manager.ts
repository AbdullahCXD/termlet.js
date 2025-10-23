import path from "path";
import chalk from "chalk";
import boxen from "boxen";
import { Class, getTermletDirectory, Require } from "../utils";
import { CommandManager } from "../cli/commands";
import { mkdirSync, readdirSync, existsSync } from "fs";
import { TermletPlugin, TermletPluginData } from "./plugin";

export interface PluginLoadResult {
  success: boolean;
  plugin?: TermletPlugin;
  error?: Error;
  metadata?: TermletPluginData;
}

export interface PluginStats {
  total: number;
  loaded: number;
  failed: number;
  disabled: number;
}

export class PluginManager {
  private directory: string;
  private plugins: Map<string, TermletPlugin> = new Map();
  private failedPlugins: Map<string, Error> = new Map();
  private disabledPlugins: Set<string> = new Set();

  constructor(private commandManager: CommandManager) {
    this.directory = path.join(getTermletDirectory(), "plugins");
    this.ensurePluginDirectory();
  }

  private ensurePluginDirectory(): void {
    if (!existsSync(this.directory)) {
      mkdirSync(this.directory, { recursive: true });
    }
  }

  /**
   * Load all plugins from the plugins directory
   */
  async load(): Promise<PluginStats> {
    const results: PluginLoadResult[] = [];

    try {
      const files = readdirSync(this.directory, {
        encoding: "utf-8",
        withFileTypes: true,
        recursive: true
      });

      for (const file of files) {
        if (!file.isFile()) continue;

        const filePath = path.join(file.parentPath, file.name);
        
        if (!this.isValidPluginFile(filePath)) continue;

        const result = await this.loadPlugin(filePath);
        results.push(result);
      }
    } catch (error) {
      console.error(chalk.red("Error reading plugins directory:"), error);
    }

    return this.getStats();
  }

  /**
   * Load a single plugin from a file path
   */
  private async loadPlugin(filePath: string): Promise<PluginLoadResult> {
    try {
      const r: Require<Class<TermletPlugin>> = require(filePath);
      let pluginInstance: TermletPlugin;

      if ("default" in r) {
        pluginInstance = new r.default();
      } else {
        pluginInstance = new r();
      }

      const metadata = pluginInstance.metadata();

      // Check if plugin is disabled
      if (this.disabledPlugins.has(metadata.name)) {
        return {
          success: false,
          metadata,
          error: new Error("Plugin is disabled")
        };
      }

      // Check for duplicate plugins
      if (this.plugins.has(metadata.name)) {
        const error = new Error(`Plugin "${metadata.name}" is already loaded`);
        this.failedPlugins.set(metadata.name, error);
        return { success: false, metadata, error };
      }

      // Validate dependencies
      const missingDeps = this.validateDependencies(metadata.dependencies);
      if (missingDeps.length > 0) {
        const error = new Error(
          `Missing dependencies: ${missingDeps.join(", ")}`
        );
        this.failedPlugins.set(metadata.name, error);
        return { success: false, metadata, error };
      }

      // Initialize plugin
      pluginInstance.context(this.commandManager);
      await pluginInstance.load();

      this.plugins.set(metadata.name, pluginInstance);

      return {
        success: true,
        plugin: pluginInstance,
        metadata
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.failedPlugins.set(path.basename(filePath), err);
      return { success: false, error: err };
    }
  }

  /**
   * Unload a specific plugin
   */
  async unload(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return false;

    try {
      await plugin.stop();
      this.plugins.delete(pluginName);
      return true;
    } catch (error) {
      console.error(chalk.red(`Failed to unload plugin "${pluginName}":`), error);
      return false;
    }
  }

  /**
   * Reload a specific plugin
   */
  async reload(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return false;

    try {
      await plugin.stop();
      this.plugins.delete(pluginName);
      
      // Find and reload the plugin file
      // This is a simplified version - you might need to track file paths
      await this.load();
      
      return this.plugins.has(pluginName);
    } catch (error) {
      console.error(chalk.red(`Failed to reload plugin "${pluginName}":`), error);
      return false;
    }
  }

  /**
   * Disable a plugin (prevents it from loading)
   */
  disable(pluginName: string): void {
    this.disabledPlugins.add(pluginName);
    this.unload(pluginName);
  }

  /**
   * Enable a previously disabled plugin
   */
  enable(pluginName: string): void {
    this.disabledPlugins.delete(pluginName);
  }

  /**
   * Get a specific plugin by name
   */
  getPlugin(name: string): TermletPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): TermletPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin statistics
   */
  getStats(): PluginStats {
    return {
      total: this.plugins.size + this.failedPlugins.size,
      loaded: this.plugins.size,
      failed: this.failedPlugins.size,
      disabled: this.disabledPlugins.size
    };
  }

  /**
   * Check if a file is a valid plugin file
   */
  private isValidPluginFile(filePath: string): boolean {
    return filePath.endsWith(".ts") || filePath.endsWith(".js");
  }

  /**
   * Validate plugin dependencies
   */
  private validateDependencies(dependencies: string[]): string[] {
    const missing: string[] = [];
    
    for (const dep of dependencies) {
      if (!this.plugins.has(dep)) {
        missing.push(dep);
      }
    }
    
    return missing;
  }

  /**
   * Display all loaded plugins in a beautiful format
   */
  listPlugins(): void {
    const stats = this.getStats();

    if (stats.total === 0) {
      console.log(
        boxen(chalk.yellow("No plugins found"), {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "yellow",
          title: "Plugins",
          titleAlignment: "center"
        })
      );
      return;
    }

    // Header with stats
    const headerContent = [
      chalk.bold.cyan(`Total: ${stats.total}`),
      chalk.bold.green(`Loaded: ${stats.loaded}`),
      stats.failed > 0 ? chalk.bold.red(`Failed: ${stats.failed}`) : null,
      stats.disabled > 0 ? chalk.bold.gray(`Disabled: ${stats.disabled}`) : null
    ]
      .filter(Boolean)
      .join(chalk.gray(" | "));

    console.log(
      boxen(headerContent, {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: "round",
        borderColor: "cyan",
        title: chalk.bold.white("Termlet Plugins"),
        titleAlignment: "center"
      })
    );

    // Loaded plugins
    if (this.plugins.size > 0) {
      console.log(chalk.bold.green("\n✓ Loaded Plugins\n"));

      for (const [name, plugin] of this.plugins) {
        const metadata = plugin.metadata();
        this.displayPlugin(metadata, "green");
      }
    }

    // Failed plugins
    if (this.failedPlugins.size > 0) {
      console.log(chalk.bold.red("\n✗ Failed Plugins\n"));

      for (const [name, error] of this.failedPlugins) {
        const content = [
          chalk.bold.red(name),
          chalk.dim.red(error.message)
        ].join("\n");

        console.log(
          boxen(content, {
            padding: { top: 0, bottom: 0, left: 1, right: 1 },
            margin: { top: 0, bottom: 1, left: 2, right: 0 },
            borderStyle: "single",
            borderColor: "red"
          })
        );
      }
    }

    // Disabled plugins
    if (this.disabledPlugins.size > 0) {
      console.log(chalk.bold.gray("\n○ Disabled Plugins\n"));
      
      for (const name of this.disabledPlugins) {
        console.log(chalk.gray(`  • ${name}`));
      }
      console.log();
    }
  }

  /**
   * Display a single plugin in a formatted box
   */
  private displayPlugin(metadata: TermletPluginData, color: string = "gray"): void {
    const lines: string[] = [];

    // Title line
    lines.push(
      chalk.bold.white(metadata.name) + 
      chalk.dim.gray(` v${metadata.version}`)
    );

    // Description
    if (metadata.description) {
      lines.push(chalk.dim(metadata.description));
    }

    // Authors
    if (metadata.authors.length > 0) {
      lines.push(
        chalk.gray("by ") + 
        chalk.cyan(metadata.authors.join(", "))
      );
    }

    // Dependencies
    if (metadata.dependencies.length > 0) {
      lines.push(
        chalk.gray("requires ") + 
        chalk.yellow(metadata.dependencies.join(", "))
      );
    }

    const content = lines.join("\n");

    console.log(
      boxen(content, {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        margin: { top: 0, bottom: 1, left: 2, right: 0 },
        borderStyle: "single",
        borderColor: color
      })
    );
  }

  /**
   * Display detailed information about a specific plugin
   */
  inspectPlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);

    if (!plugin) {
      console.log(
        boxen(chalk.red(`Plugin "${pluginName}" not found`), {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "red"
        })
      );
      return;
    }

    const metadata = plugin.metadata();
    const lines: string[] = [];

    lines.push(chalk.bold.cyan("Name: ") + chalk.white(metadata.name));
    lines.push(chalk.bold.cyan("Version: ") + chalk.white(metadata.version));

    if (metadata.description) {
      lines.push(chalk.bold.cyan("Description: ") + chalk.white(metadata.description));
    }

    if (metadata.authors.length > 0) {
      lines.push(chalk.bold.cyan("Authors: ") + chalk.white(metadata.authors.join(", ")));
    }

    if (metadata.dependencies.length > 0) {
      lines.push(chalk.bold.cyan("Dependencies:"));
      for (const dep of metadata.dependencies) {
        const status = this.plugins.has(dep) 
          ? chalk.green("✓") 
          : chalk.red("✗");
        lines.push(`  ${status} ${dep}`);
      }
    } else {
      lines.push(chalk.bold.cyan("Dependencies: ") + chalk.gray("none"));
    }

    console.log(
      boxen(lines.join("\n"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        title: "Plugin Information",
        titleAlignment: "center"
      })
    );
  }
}