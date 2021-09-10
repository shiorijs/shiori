const EventEmitter = require("events");
const LimitedCollection = require("../utils/LimitedCollection");
const GatewayManager = require("./gateway/GatewayManager");
const RestManager = require("../rest/RestManager");
const PluginsManager = require("../managers/PluginsManager");

const Constants = require("../utils/Constants");
const Option = require("../utils/Option");
const ClientUtils = require("./ClientUtils");
const UsersManager = require("../managers/UsersManager");

class Client extends EventEmitter {
  /**
   * @param {string} token The client token
   * @param {object} clientOptions The client options
   */
  constructor (token, clientOptions) {
    super();

    if (!token || typeof (token) !== "string") throw new Error("No token was assigned on \"Client\"!");

    this.options = Option.defaultOptions(clientOptions);

    if (this.options.shardCount <= 0) throw new Error("shardCount cannot be lower or equal to 0");

    this.ws = new GatewayManager(this);
    this.rest = new RestManager(this, clientOptions);
    this.utils = new ClientUtils(this);
    this.plugins = this.options.plugins.map(p => p?.name);

    this.users = new UsersManager(this);

    Object.defineProperties(this, {
      guilds: { value: new LimitedCollection(this.options.cache.guilds), writable: false },
      shards: { value: new LimitedCollection(), writable: false },
      token: { value: token, writable: false },
      channelMap: { value: { }, writable: true }
    });

    if ("intents" in this.options) {
      if (Array.isArray(this.options.intents)) {
        let bitmask = 0;

        for (const intent of this.options.intents) {
          if (Constants.INTENTS[intent]) bitmask |= Constants.INTENTS[intent];
        }

        this.options.intents = bitmask;
      }
    }
  }

  /**
   * Create a connection between your bot and discord.
   * @example
   * const client = new Shiori.Client("TOKEN");
   *
   * client.start();
   */
  start () {
    const shards = Array.from({ length: this.options.shardCount }, (_, i) => i);

    this.options.shards = [...new Set(shards)];

    try {
      this.ws.createShardConnection();

      if (this.options.plugins.length) new PluginsManager(this, this.options.plugins);
    } catch (error) {
      if (!this.options.autoReconnect) throw error;

      setTimeout(() => this.ws.createShardConnection(), 3000);
    }
  }

  /**
  * @param {string} type Type of the structure to fetch, user, role, channel or guild
  * @param {string} id ID of an user, role, channel or guild to fetch
  */
  getInformation () {
    return true;
  }
}

module.exports = Client;
