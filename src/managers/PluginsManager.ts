import Client from "../client/Client";

class PluginManager {
  private client: Client;
  private plugins: Array<any>;

  constructor (client: Client, plugins: Array<any>) {
    this.client = client;
    this.plugins = [];

    if (plugins.length) this.startPlugins(plugins);
  }

  get api () {
    return this.client.rest.api;
  }

  startPlugins (plugins: Array<any>) {
    for (const Plugin of plugins) {
      const plugin = new Plugin(this);

      if (this.plugins.find(c => c.name === plugin.name))
        throw new Error(`A plugin with the name "${plugin.name}" already exists on the same client.`);

      if (plugin._manager !== undefined && typeof plugin.name === "string")
        this.client[plugin.name] = plugin._manager;

      this.plugins.push(plugin);
    }
  }
  on (eventName: string, options: EventOptions) {
    const identifier = options.identifier || "on";
    const promise = options.promise ?? false;
    const callback = options.callback ?? undefined;

    if (typeof eventName !== "string") {
      throw new Error(`Event name must be of type string, received ${typeof eventName} instead`);
    }

    if (!["on", "once"].includes(identifier)) {
      throw new Error(`Identifier must be "on" or "once" only, received ${identifier} instead.`);
    }

    if (!promise) this.client[identifier](eventName, callback);
    else {
      return new Promise((resolve) => {
        this.client[identifier](eventName, (...args: unknown[]) => {
          resolve(args);
        });
      });
    }
  }

  public emit (eventName: string, ...args: unknown[]): void {
    if (typeof eventName !== "string") {
      throw new Error(`Event Name must be of type string, received ${typeof eventName} instead`);
    }

    this.client.emit(eventName, ...args);
  }

  public executeClientMethod (methodName: string, ...args: unknown[]): void {
    return this.client[methodName](...args);
  }
}

interface EventOptions {
  identifier: string;
  callback: () => any;
  promise: boolean;
}

export default PluginManager;
