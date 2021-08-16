const Base = require("./Base");

/**
  * Represents a discord message
  * @extends {Base}
  */
class Message extends Base {
  /**
   * @param {Client} client Hitomi Client
   * @param {Object} data The message structure data
   */
  constructor (data, client) {
    super(client);

    this._update(data);
  }

  _update (data) {
    /**
     * Message ID
     * @type {String}
     */
    this.id = data.id;

    if (data.channel_id) {
      /**
       * The channel id in which the message was sent
       * @type {String}
       */
      this.channelID = data.channel_id;
    }

    if (data.guild_id) {
      /**
       * The guild id in which the message was sent
       * @type {String}
       */
      this.guildID = data.guild_id;
    }

    if (data.user?.id) {
      /**
       * The user that created the message
       * @type {User}
       */
      this.author = this.client.users.get(data.user.id);
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
     * Reference object that contains all the mentions in the message
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
      }
    }

    if (data.attachments) {
      /**
       * The attachments from the message
       * @type {Array}
       */
      this.attachments = data.attachments;
    }

    if (data.embeds?.length) {
      /**
       * The embeds from the message
       * @type {Array}
       */
      this.embeds = data.embeds;
    }

    if (data.type) {
      /**
       * The type of the message
       * @type {Number}
       */
      this.type = data.type;
    }

    if (data.flags) {
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

  delete () {
    return this.client.rest.api.channels[this.channelID].messages[this.id].delete();
  }

  edit (options) {
    if (typeof (options) === "string") options = { content: options };

    return this.client.rest.api.channels[this.channelID].messages[this.id].patch({ data: options });
  }

  addReaction (reaction) {
    return this.client.addMessageReaction(this.id, this.channelID, reaction)
  }
};

module.exports = Message;
