const Utils = require("../utils/Utils");
const Base = require("./Base");

/**
  * Represents a discord message
  * @extends {Base}
  */
class Message extends Base {
  /**
   * @param {Client} client Shiori Client
   * @param {Object} data The message structure data
   */
  constructor (data, client) {
    super(client);

    this._update(data);
  }

  _update (data) {
    if (!data) return;

    /**
     * Message ID
     * @type {String}
     */
    this.id = data.id;

    if (data.channel_id) {
      /**
       * The channel in which the message was sent
       * @type {BaseGuildChannel}
       */
      this.channel = new Utils(this.client).getChannel(data.channel_id) || { id: data.channel_id };
    }

    if (data.guild_id) {
      /**
       * The guild in which the message was sent
       * @type {Guild}
       */
      this.guild = this.client.guilds.get(data.guild_id) || { id: data.guild_id };
    }

    if (data.author?.id) {
      /**
       * The user that created the message
       * @type {User}
       */
      this.author = this.client.users.get(data.author.id);
    }

    if (data.content) {
      /**
       * The message content
       * @type {String}
       */
      this.content = data.content;
    }

    if (data.timestamp) {
      /**
       * The time the message was created
       * @type {Data}
       */
      this.timestamp = new Date(data.timestamp);
    }

    /**
     * Reference object that contains all the mentions in a message
     * @typedef {Object} MessageMentions
     * @property {Boolean} everyone Whether the message mentions everyone
     * @property {Array<String>} users The users that were mentioned in the message
     * @property {Array<String>} roles The roles that were mentioned in the message
     * @property {Array<String>} channels The channels that were mentioned in the message
     */

    if (data.mentions) {
      /**
       * Mentions that are included in this message
       * @type {MessageMentions}
       */
      this.mentions = {
        everyone: Boolean(data.mention_everyone) ?? false,
        users: data.mentions || [],
        roles: data.mention_roles || [],
        channels: data.mention_channels || []
      };
    }

    if (data.attachments?.length) {
      /**
       * The attachments that belongs to the message
       * @type {Array}
       */
      this.attachments = data.attachments;
    }

    if (data.embeds?.length) {
      /**
       * The embeds that belongs to the message
       * @type {Array}
       */
      this.embeds = data.embeds;
    }

    if (data.type !== undefined) {
      /**
       * The type of the message
       * @type {Number}
       */
      this.type = data.type;
    }

    if (data.flags !== undefined) {
      /**
       * The message flags
       * @type {Number}
       */
      this.flags = data.flags ?? 0;
    }

    if (data.components?.length) {
      /**
       * The message components
       * @type {Array}
       */
      this.components = data.components;
    }
  }

  /**
    * Deletes this message.
    * @returns {Promise<void>}
    */
  async delete () {
    await this.client.rest.api.channels(this.channel.id).messages(this.id).delete();
  }

  /**
    * Creates a reaction in this message.
    * @returns {Promise<void>}
    */
  async addReaction (reaction) {
    await this.client.rest.api
      .channels(this.channel.id)
      .messages(this.id)
      .reactions[encodeURIComponent(reaction)]["@me"].put();
  }

  /**
    * Edits a message.
    * @params {MessageEditOptions} options The options to be used when editing the message
    * @returns {Promise<void>}
    */
  async edit (options) {
    if (typeof (options) === "string") options = { content: options };

    await this.client.rest.api.channels(this.channel.id).messages(this.id).patch({ data: options });
  }
}

module.exports = Message;
