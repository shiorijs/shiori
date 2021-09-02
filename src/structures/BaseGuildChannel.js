const Channel = require("./Channel");
const Collection = require("../utils/Collection");
const { ChannelTypes } = require("../utils/Constants");

/**
 * Represents a guild channel.
 * @extends {Channel}
 */
class BaseGuildChannel extends Channel {
  /**
   * @param {object} data The guild channel structure data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(data, client);

    /**
     * Guild id this channel belongs to
     * @type {string}
     */
    this.guildId = data.guildId;

    /**
      * The type of the channel
      * @type {string}
      */
    this.type = ChannelTypes[data.type] ?? "UNKNOWN";

    /**
     * Messages that belongs to this channel
     * @type {Collection<string, Message>}
     * @name BaseGuildChannel#messages
     */
    Object.defineProperty(this, "messages", { value: new Collection(), writable: true });
  }

  _update (data) {
    /**
     * The id of this channel
     * @type {string}
     */
    this.id = data.id;

    if ("name" in data) {
      /**
       * The name of this channel
       * @type {string}
       */
      this.name = data.name;
    }

    if ("position" in data) {
      /**
       * The position of this channel
       * @type {number}
       */
      this.position = data.position;
    }

    if ("parent_id" in data) {
      /**
       * The category id of this channel
       * @type {string}
       */
      this.parentId = data.parent_id;
    }

    if (data.nsfw !== undefined) {
      /**
       * Whether this channel is marked as nsfw or not
       * @type {boolean}
       */
      this.nsfw = Boolean(data.nsfw);
    }
  }
}

module.exports = BaseGuildChannel;
