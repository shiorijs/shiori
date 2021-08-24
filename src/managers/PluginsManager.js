module.exports = class PluginManager {
  #client;
  #plugins;

  constructor (client, plugins) {
    this.#client = client;
    this.#plugins = [];

    if (plugins.length) this.startPlugins(plugins);
  }

  get api () {
    return this.#client.rest.api;
  }

  startPlugins (plugins) {
    for (const Plugin of plugins) {
      const _plugin = new Plugin(this);

      if (this.#plugins.find(c => c.name === _plugin.name))
        throw new Error(`A plugin with the name "${_plugin.name}" already exists on the same client.`);

      if (_plugin._manager !== undefined && typeof _plugin.name === "string")
        this.#client[_plugin.name] = _plugin._manager;

      this.#plugins.add(_plugin);
    }
  }

  on (eventName, { identifier = "on", callback = undefined, promise = false } = {}) {
    if (typeof eventName !== "string") {
      throw new Error(`Event name must be of type string, received ${typeof eventName} instead`);
    }

    if (!["on", "once"].includes(identifier)) {
      throw new Error(`Identifier must be "on" or "once" only, received ${identifier} instead.`);
    }

    if (!promise) this.#client[identifier](eventName, callback);
    else {
      return new Promise((resolve) => {
        this.#client[identifier](eventName, (...args) => {
          resolve(...args);
        });
      });
    }
  }

  emit (eventName, ...args) {
    if (typeof eventName !== "string") {
      throw new Error(`Event Name must be of type string, received ${typeof eventName} instead`);
    }

    this.#client.emit(eventName, ...args);
  }

  executeClientMethod (methodName, ...args) {
    return this.#client[methodName](...args);
  }
};
