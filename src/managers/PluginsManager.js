class PluginManager {
  #plugins;

  constructor (client, plugins) {
    this.client = client;
    this.#plugins = [];

    if (plugins.length) this.startPlugins(plugins);
  }

  startPlugins (plugins) {
    for (const Plugin of plugins) {
      const plugin = new Plugin(this.client);

      if (this.#plugins.find(c => c.name === plugin.name))
        throw new Error(`A plugin with the name "${plugin.name}" already exists on this client.`);

      if (typeof plugin.name === "string")
        this.client[plugin.name] = plugin.manager ?? plugin;

      this.#plugins.push(plugin);
    }
  }
}

module.exports = PluginManager;
