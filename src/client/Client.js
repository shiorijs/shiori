const EventEmitter = require("events");
const Collection = require("../utils/Collection");
const GatewayManager = require("./gateway/GatewayManager");

const Constants = require("../utils/Constants");
const Endpoints = require("../utils/Endpoints");

// Structures
const Guild = require("../structures/Guild");

module.exports = class Client extends EventEmitter {
  constructor (token, clientOptions) {
    super();

    if (!token || typeof (token) !== "string") throw new Error("No token was assigned on \"Client\"!");

    this.options = Object.assign({
      ws: { version: 9 },
      rest: {
        version: Constants.REST.API_VERSION,
        fetchAllUsers: false
      },
      shardCount: 1,
      blockedEvents: [],
      autoReconnect: true
    }, clientOptions);

    this.ws = new GatewayManager(this);

    Object.defineProperties(this, {
      "users": { value: new Collection(), writable: false },
      "guilds": { value: new Collection(Guild), writable: false },
      "channels": { value: new Collection(), writable: false },
      "token": { value: token, writable: false }
    });

    if (this.options.hasOwnProperty("intents")) {
      if (Array.isArray(this.options.intents)) {
        let bitmask = 0;

        for (const intent of this.options.intents) {
          if (Constants.INTENTS[intent]) bitmask |= Constants.INTENTS[intent];
        }

        this.options.intents = bitmask;
      }
    }
  }

  async start () {
    const shards = Array.from({ length: this.options.shardCount }, (_, i) => i);

    this.options.shards = [...new Set(shards)];

    try {
      this.ws.createShardConnection();
    } catch (error) {
      if (!this.options.autoReconnect) throw error

      setTimeout(() => this.ws.createShardConnection(), 3000);
    }
  };

  /**
   * @param {String} type Type of the structure to fetch, user, role, channel or guild
   * @param {String} id ID of an user, role, channel or guild to fetch
  */
  async getInformation (type, ...id) {
    const url = Endpoints[type.replace(/[ ]/g, "_")](...id);

    return this.api.request("GET", url, null, true);
  };
};
