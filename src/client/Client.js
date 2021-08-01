const EventEmitter = require("events");
const Collection = require("../utils/Collection");
const GatewayManager = require("./gateway/GatewayManager");

const Constants = require("../utils/Constants")

module.exports = class Client extends EventEmitter {
  constructor (token, clientOptions) {
    super();

    this.options = Object.assign({
      websocket: {
        version: 9
      },
      shardCount: 1,
      blockedEvents: [],
      autoReconnect: true
    }, clientOptions);
    this.ws = new GatewayManager(this);

    Object.defineProperty(this, "users", { value: new Collection(), writable: false });
    Object.defineProperty(this, "guilds", { value: new Collection(), writable: false });
    Object.defineProperty(this, "channels", { value: new Collection(), writable: false });
    Object.defineProperty(this, "token", { value: token, writable: false });

    if(this.options.hasOwnProperty("intents")) {
      if(Array.isArray(this.options.intents)) {
        let bitmask = 0;

        for (const intent of this.options.intents) {
          if (Constants.intents[intent]) bitmask |= Constants.Intents[intent]
        }

        this.options.intents = bitmask;
      }
    }
  }

  async start() {
    const shards = Array.from({ length: this.options.shardCount }, (_, i) => i);

    this.options.shards = [...new Set(shards)];

    try {
      this.ws.createShardConnection();
    } catch (error) {
      if (!this.options.autoReconnect) throw error

      setTimeout(() => this.start, 3000);
    }
  };

  /**
   * @param {String} id ID of an user, role, channel or guild to fetch
   * @param {String} type Type of the structure to fetch, user, role, channel or guild
  */
  async getInformation(id, type) {
    const url = "";

    return this.api.request("GET", url, null, true);
  };
};
