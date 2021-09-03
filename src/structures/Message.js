const Base = require("./Base");

/**
  * Represents a discord message
  * @extends {Base}
  */
class Message extends Base {
  /**
  * @param {object} data The message structure data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(client);

    this._update(data);
  }

  _update (data) {
    if (!data) return;

    /**
     * Message ID
     * @type {string}
     */
    this.id = data.id;

    /**
     * The message flags
     * @type {number}
     */
    this.flags = data.flags ?? 0;

    if ("channel_id" in data) {
      /**
       * The channelId in which the message was sent
       * @type {string}
       */
      this.channelId = data.channel_id;
    }

    if ("guild_id" in data) {
      /**
       * The guildId in which the message was sent
       * @type {string}
       */
      this.guildId = data.guild_id;
    }

    if (data.author?.id) {
      /**
       * The user that created the message
       * @type {User}
       */
      this.author = this.client.users.get(data.author.id);
    }

    if ("content" in data) {
      /**
       * The message content
       * @type {string}
       */
      this.content = data.content;
    }

    if ("timestamp" in data) {
      /**
       * The time the message was created
       * @type {Date}
       */
      this.timestamp = new Date(data.timestamp);
    }

    /**
     * Reference object that contains all the mentions in a message
     * @typedef {object} MessageMentions
     * @property {boolean} everyone Whether the message mentions everyone
     * @property {string[]} users The users that were mentioned in the message
     * @property {string[]} roles The roles that were mentioned in the message
     * @property {string[]} channels The channels that were mentioned in the message
     */

    if ("mentions" in data) {
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
       * @type {number}
       */
      this.type = data.type;
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
   * The channel in which this message was sent
   * @type {?TextChannel}
   * @readonly
   */
  get channel () {
    return this.client.utils.getChannel(this.channelId) ?? null;
  }

  /**
   * The guild in which this message was sent
   * @type {?Guild}
   * @readonly
   */
  get guild () {
    return this.client.guilds.get(this.guildId) ?? null;
  }

  get deletable () {
    return true;
  }

  get editable () {
    return true;
  }

  /**
   * The member that sended this message
   * @type {?Member}
   * @readonly
   */
  get member () {
    return this.guild.members.get(this.author?.id) ?? null;
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
    * @param {string} reaction The reaction to be added
    * @returns {Promise<void>}
    */
  async react (reaction) {
    await this.client.rest.api
      .channels(this.channel.id)
      .messages(this.id)
      .reactions[encodeURIComponent(reaction)]["@me"].put();
  }

  /**
    * Edits a message.
    * @param {MessageEditOptions} options The options to be used when editing the message
    * @returns {Promise<void>}
    */
  async edit (options) {
    if (typeof (options) === "string") options = { content: options };

    await this.client.rest.api.channels(this.channel.id).messages(this.id).patch({ data: options });
  }

  async pin () {
    await this.client.rest.api.channels(this.channel.id).pins(this.id).put();
  }
}

module.exports = Message;
