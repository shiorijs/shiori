const EventEmitter = require("../utils/EventEmitter");
const GatewayManager = require("./gateway/GatewayManager");
const RestManager = require("../rest/RestManager");
const PluginsManager = require("../managers/PluginsManager");

const Constants = require("../utils/Constants");
const Option = require("../utils/Option");
const ClientUtils = require("./ClientUtils");
const UsersCache = require("../cache/UsersCache");
const GuildsCache = require("../cache/GuildsCache");

class Client extends EventEmitter {
  /**
   * @param {string} token The client token
   * @param {ClientOptions} options The client options
   */
  constructor (token, options) {
    super();

    if (!token || typeof (token) !== "string") throw new Error("No token was assigned on \"Client\"!");

    /**
     * Client Options
     * @type {ClientOptions}
     */
    this.options = Option.defaultOptions(options);

    if (this.options.shardCount <= 0) this.options.shardCount = 1;

    /**
     * Websocket Manager
     * @type {GatewayManager}
     */
    this.gateway = new GatewayManager(this);

    /**
     * Rest Manager that handles https requests
     * @type {RestManager}
     */
    this.rest = new RestManager(this, options.rest);

    /**
     * Client Utilities functions
     * @type {ClientUtils}
     */
    this.utils = new ClientUtils(this);

    /**
     * An array of plugins, mapped by their name
     * @type {string[]}
     */
    this.plugins = this.options.plugins.map(p => p?.name);

    /**
     * All of the {@link User} objects that have been cached until now
     * @type {UsersCache}
     */
    this.users = new UsersCache(this);

    /**
     * All of the {@link Guild} objects that have been cached until now
     * @type {GuildsCache}
     */
    this.guilds = new GuildsCache(this);

    Object.defineProperties(this, {
      token: { value: token, writable: false },
      channelMap: { value: { }, writable: true }
    });

    if (Array.isArray(this.options.intents)) {
      let bitmask = 0;

      for (const intent of this.options.intents) {
        if (Constants.INTENTS[intent]) bitmask |= Constants.INTENTS[intent];
      }

      this.options.intents = bitmask;
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
    if (this.rest.token == undefined) this.rest.setToken(this.token);

    try {
      this.gateway.connect();

      if (this.options.plugins.length) new PluginsManager(this, this.options.plugins);
    } catch (error) {
      if (!this.options.autoReconnect) throw error;

      setTimeout(() => this.gateway.connect(), 5000);
    }
  }

  debug (message, tag) {
    if (Array.isArray(message)) message = message.join(`\n[${tag}]: `);

    this.emit("debug", `[${tag}]: ${message}`)
  }
}

module.exports = Client;
