const BaseGuildChannel = require("./BaseGuildChannel");
const Message = require("./Message");

/**
 * Represents a text channel.
 * @extends {BaseGuildChannel}
 */
class TextChannel extends BaseGuildChannel {
  /**
   * @param {object} data The text channel structure data
   * @param {Client} client Shiori Client
   */
  constructor (data, client) {
    super(data, client);

    this._update(data);
  }

  _update (data) {
    super._update(data);

    if (data.rate_limit_per_user !== undefined) {
      /**
       * The time a user must waits before sending another message in this channel
       * @type {number}
       */
      this.slowmodeTime = data.rate_limit_per_user;
    }

    if ("topic" in data) {
      /**
       * The topic of this channel
       * @type {string}
       */
      this.topic = data.topic;
    }

    if ("permission_overwrites" in data) {
      /**
       * The permission overwrites of this channel.
       * @type {PermissionOverwrite[]}
       */
      this.permissionOverwrites = data.permissionOverwrites;
    }

    if ("last_message_id" in data) {
      /**
       * The last message of this channel. If not cached, will return only the id.
       * @type {Message | object}
       */
      this.lastMessage = this.messages.get(data.last_message_id) ?? { id: data.last_message_id };
    }
  }

  /**
    * Create a message in this text channel.
    * @param {MessageCreateOptions} options Options to be used when creating the message
    * @returns {Promise<Message>}
    */
  send (options) {
    if (typeof (options) !== "object") options = { content: String(options) };

    return this.client.rest.api.channels(this.id).messages.post({ data: options })
      .then((data) => new Message(data, this.client));
  }

  /**
   * Delete this channel.
   * @param {string} [reason] Reason for deleting this channel
   * @returns {Promise<void>}
   */
  async delete (reason) {
    await this.client.rest.api.channels(this.id).delete({ data: { reason } });
  }
}

module.exports = TextChannel;
