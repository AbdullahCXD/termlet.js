import { ComponentRegistry } from "../component/registry";
import { logger, parseBoolean } from "../utils";
import { Store } from "./store";

type MetaAction = (key: string, value: string | boolean | number | symbol) => boolean;

export class MetaStore extends Store<string | boolean | number | symbol> {
  private actions: Map<string, MetaAction> = new Map();

  constructor() {
    super();
    this.onSet("terminal.title", (key, value) => {
      process.title = value as string;
      return true;
    });
    this.onSet("language.warnings", (key, value) => {
      logger.warningsType(value as string);
      return true;
    });
    this.onSet("terminal.log", (key, value) => {
      let val = parseBoolean(value as string);

      if (typeof val !== "boolean") return false;

      ComponentRegistry.log = val;

      return true;
    });
  }

  // Set a key-value pair, running any pre-set action
  set(key: string, value: string | boolean | number | symbol): void {
    const action = this.actions.get(key);
    if (action) {
      const result = action(key, value);
      if (!result) return;
    }
    super.set(key, value);
  }


  // Register an action for a specific key
  onSet(key: string, action: MetaAction): void {
    this.actions.set(key, action);
  }

  // Remove an action for a key
  removeAction(key: string): void {
    this.actions.delete(key);
  }

}

export const GlobalMetaStore = new MetaStore();