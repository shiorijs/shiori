const Channel = require("./Channel");
const { ChannelTypes } = require("../utils/Constants");

/**
 * Represents a guild channel.
 * @extends {Channel}
 */
class BaseGuildChannel extends Channel {
  constructor (data, client) {
    super(data, client);

    /**
     * Guild this channel belongs to
     * @type {Guild}
     */
     this.guild = data.guild;

     /**
      * The type of the channel
      * @type {String}
      */
     this.type = ChannelTypes[data.type] ?? 'UNKNOWN';
  }

  _update (data) {
    /**
     * The id of this channel
     * @type {String}
     */
    this.id = data.id

    if (data.name) {
      /**
       * The name of this channel
       * @type {String}
       */
      this.name = data.name
    }

    if (data.position) {
      /**
       * The position of this channel
       * @type {Number}
       */
      this.position = data.position;
    }

    if (data.parent_id) {
      /**
       * The category id of this channel
       * @type {String}
       */
      this.parentID = data.parent_id;
    }

    if (data.nsfw !== undefined) {
      /**
       * Whether this channel is marked as nsfw or not
       * @type {Boolean}
       */
      this.nsfw = data.nsfw;
    }
  }
}

module.exports = BaseGuildChannel;
