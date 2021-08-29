import { REST } from "./Constants";

export default class Option {
  static updateOptionsWithDefaults (options: object): object {
    options = this.mergeOptions(this.defaultOptions, options);

    return options;
  }

  static mergeOptions (def, given) {
    if (!given) return def;

    for (const key in def) {
      if (!Object.prototype.hasOwnProperty.call(given, key) || given[key] === undefined)
        given[key] = def[key];
      else if (given[key] === Object(given[key]))
        given[key] = this.mergeOptions(def[key], given[key]);
    }

    return given;
  }

  private static get defaultOptions () {
    const cachesOptions = {
      limit: Infinity,
      toAdd: () => true,
      toRemove: () => true,
      sweep: 10,
      sweepTimeout: 60000
    };

    return {
      ws: {
        version: 9
      },
      rest: {
        version: REST.API_VERSION,
        fetchAllUsers: false
      },
      intents: 0,
      shardCount: 1,
      blockedEvents: [],
      autoReconnect: true,
      connectionTimeout: 15000,
      plugins: [],
      cache: {
        users: { ...cachesOptions },
        guilds: { ...cachesOptions }
      }
    };
  }
};
