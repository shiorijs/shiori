const Constants = require("./Constants");

module.exports = class Option {
  static defaultOptions (options) {
    options = this.mergeOptions(this.#defaultClientOptions, options);

    return options;
  }

  static mergeOptions (def, given) {
    if (!given) return def;

    const has = (o, p) => Object.prototype.hasOwnProperty.call(o, p);

    for (const key in def) {
      if (!has(given, key) || given[key] === undefined)
        given[key] = def[key];
      else if (given[key] === Object(given[key]))
        given[key] = this.mergeOptions(def[key], given[key]);
    }

    return given;
  }

  static get #defaultClientOptions () {
    const cacheOptions = {
      limit: Infinity,
      toAdd: () => true,
      toRemove: () => true,
      sweep: 10,
      sweepTimeout: 60000
    };

    return {
      ws: {
        version: Constants.GATEWAY.VERSION
      },
      rest: {
        version: Constants.REST.API_VERSION,
        fetchAllUsers: false,
        timeout: 15000
      },
      defaultFormat: "png",
      defaultSize: 2048,
      intents: 0,
      shardCount: 1,
      blockedEvents: [],
      autoReconnect: true,
      connectionTimeout: 15000,
      plugins: [],
      cache: {
        users: { ...cacheOptions },
        guilds: { ...cacheOptions },
        channels: { ...cacheOptions },
        members: { ...cacheOptions },
        messages: { ...cacheOptions },
        roles: { ...cacheOptions }
      }
    };
  }
};
