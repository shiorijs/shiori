const EventEmitter = require("events");
const Collection = require("../utils/Collection");
const GatewayManager = require("./gateway/GatewayManager");
const RestManager = require("../rest/RestManager");

const Constants = require("../utils/Constants");

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

    if (this.options.shardCount <= 0) throw new Error("shardCount cannot be lower or equal to 0");

    this.ws = new GatewayManager(this);
    this.rest = new RestManager(this);

    Object.defineProperties(this, {
      users: { value: new Collection(), writable: false },
      guilds: { value: new Collection(), writable: false },
      channels: { value: new Collection(), writable: false },
      token: { value: token, writable: false },
      channelMap: { value: { }, writable: true }
    });

    if (Object.prototype.hasOwnProperty.call(this.options, "intents")) {
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
   * const client = new Hitomi.Client("TOKEN", {});
   *
   * client.start();
   */
  start () {
    const shards = Array.from({ length: this.options.shardCount }, (_, i) => i);

    this.options.shards = [...new Set(shards)];

    try {
      this.ws.createShardConnection();
    } catch (error) {
      if (!this.options.autoReconnect) throw error;

      setTimeout(() => this.ws.createShardConnection(), 3000);
    }
  }

  /**
  * @param {String} type Type of the structure to fetch, user, role, channel or guild
  * @param {String} id ID of an user, role, channel or guild to fetch
  */
  getInformation () {
    return true;
  }

  addMessageReaction (messageID, channelID, reaction) {
    return this.rest.api
      .channels[channelID]
      .messages[messageID]
      .reactions[encodeURIComponent(reaction)]["@me"].put();
  }

  getChannel (channelId) {
    const guildId = this.channelMap[channelId];

    if (!guildId) return null;

    else return this.guilds.get(guildId).channels.get(channelId);
  }
};
