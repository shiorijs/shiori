/* eslint-disable no-console */
const _ = require("lodash.merge");

const Constants = require("./Constants");

module.exports = class Option {
  static updateOptionsWithDefaults (options) {
    options = _(this.#defaultOptions, options);

    return options;
  }

  static get #defaultOptions () {
    // const cachesOptions = {
    //   limit: Infinity,
    //   allowed: () => true,
    //   toRemove: () => true,
    //   sweep: 10,
    //   sweepTimeout: 60000
    // };

    return {
      ws: {
        version: 9
      },
      rest: {
        version: Constants.REST.API_VERSION,
        fetchAllUsers: false
      },
      intents: 0,
      shardCount: 1,
      blockedEvents: [],
      autoReconnect: true,
      connectionTimeout: 15000,
      plugins: []
      // cache: {
      //   users: { ...cachesOptions },
      //   guilds: { ...cachesOptions }
      // }
    };
  }
};
