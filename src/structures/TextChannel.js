const BaseGuildChannel = require("./BaseGuildChannel");
const Message = require("./Message");

/**
 * Represents a text channel.
 * @extends {BaseGuildChannel}
 */
class TextChannel extends BaseGuildChannel {
  constructor (data, client) {
    super(data, client);

    this._update(data);
  }

  _update (data) {
    super._update(data);

    if (data.rate_limit_per_user !== undefined) {
      /**
       * The time a user must waits before sending another message in this channel
       * @type {Number}
       */
      this.slowmodeTime = data.rate_limit_per_user;
    }

    if ("topic" in data) {
      /**
       * The topic of this channel
       * @type {String}
       */
      this.topic = data.topic;
    }
  }

  /**
    * Create a message in this text channel.
    * @returns {Promise<Message>}
    */
  send (options) {
    if (typeof (options) !== "object") options = { content: String(options) };

    return this.client.rest.api.channels(this.id).messages.post({ data: options })
      .then((data) => new Message(data, this.client));
  }

  /**
   * Delete this channel.
   * @param {String} [reason] Reason for deleting this channel
   * @returns {Promise<void>}
   */
  async delete (reason) {
    await this.client.rest.api.channels(this.id).delete({ data: { reason } });
  }
}

module.exports = TextChannel;
