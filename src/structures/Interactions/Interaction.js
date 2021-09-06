const {
  InteractionTypes, InteractionResponseTypes, MessageComponentTypes, CommandTypes
} = require("../../utils/Constants");

const Base = require("../Base");
const Member = require("../Member");
const Message = require("../Message");

/**
 * Represents an interaction on Discord.
 * @extends {Base}
 */
class Interaction extends Base {
  /**
   * @param {object} data The interaction data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(client);

    /**
     * The interaction id
     * @type {string}
     */
    this.id = data.id;

    /**
      * The interaction type
      * @type {number}
      */
    this.type = data.type;

    /**
      * Whether this interaction has been responded.
      * @type {boolean}
      */
    this.responded = false;

    /**
     * The interaction token
     * @type {string}
     * @name Interaction#token
     * @readonly
     */
    Object.defineProperty(this, "token", { value: data.token });
  }

  _update (data) {
    if ("application_id" in data) {
      /**
       * The application's id
       * @type {string}
       */
      this.applicationId = data.application_id;
    }

    if ("channel_id" in data) {
      /**
       * The id of the channel this interaction was sent in
       * @type {string}
       */
      this.channelId = data.channel_id;
    }

    if ("guild_id" in data) {
      /**
       * The id of the guild this interaction was sent in
       * @type {string}
       */
      this.guildId = data.guild_id;
    }

    if ("user" in data) {
      /**
       *  If this interaction was executed in a DM, the user id of who executed it 
       * @type {string}
       */
      this.userId = data.user.id;
    }

    if ("member" in data) {
      /**
       * If this interaction was executed in a guild, the member who executed it
       * @type {Member}
       */
      this.member = this.guild?.members.add(data.member.user.id, new Member(data.member));
    }
  }

  static transform (data, client) {
    const ApplicationCommandInteraction = require("./ApplicationCommandInteraction");
    const MessageComponentInteraction = require("./MessageComponentInteraction");

    switch (data.type) {
      case InteractionTypes.APPLICATION_COMMAND: {
        return new ApplicationCommandInteraction(data, client);
      }
      case InteractionTypes.MESSAGE_COMPONENT: {
        return new MessageComponentInteraction(data, client);
      }
    }

    return new Interaction(data, client);
  }

  /**
    * Check if this interaction is a context menu
    * @returns {boolean}
    */
  isContextMenu () {
    return (
      this.type === InteractionTypes.APPLICATION_COMMAND &&
      this.targetId !== undefined
    );
  }

  /**
    * Check if this interaction is a slash command
    * @returns {boolean}
    */
  isSlashCommand () {
    return this.command?.type === CommandTypes.CHAT_INPUT;
  }

  /**
    * Check if this interaction is a select menu
    * @returns {boolean}
    */
  isSelectMenu () {
    return (
      this.type === InteractionTypes.MESSAGE_COMPONENT &&
      this.componentType === MessageComponentTypes.SELECT_MENU
    );
  }

  /**
    * Check if this interaction is a button
    * @returns {boolean}
    */
  isButton () {
    return (
      this.type === InteractionTypes.MESSAGE_COMPONENT &&
      this.componentType === MessageComponentTypes.BUTTON
    );
  }

  /**
   * The channel this interaction was sent in
   * @type {?Channel}
   * @readonly
   */
  get channel () {
    return this.client.utils.getChannel(this.channelId) ?? null;
  }

  /**
   * The guild this interaction was sent in
   * @type {?Guild}
   * @readonly
   */
  get guild () {
    return this.client.guilds.get(this.guildId) ?? null;
  }

  /**
   * The user that executed this interaction
   * @type {?User}
   * @readonly
   */
  get user () {
    return this.userId
      ? this.client.users.get(this.userId) ?? null
      : this.member.user;
  }

  /**
    * Creates a reply message for this interaction.
    * @param {InteractionMessageCreateOptions} options The options to be used when creating the response
    * @returns {Promise}
    */
  async reply (options) {
    if (this.responded) return await this.createFollowup(options);

    if (typeof (options) === "string") options = { content: String(options) };

    if (options.ephemeral) {
      options.flags |= 64;

      delete options.ephemeral;
    }

    await this.client.rest.api
      .interactions(this.id)(this.token).callback.post({
        data: {
          type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
          data: options
        }
      });

    return (this.responded = true, await this.getMessage());
  }

  /**
    * Creates a defer response for this interaction.
    * @param {boolean} [ephemeral=false] If the response will be ehpemeral
    * @returns {Promise}
    */
  async defer (ephemeral = false) {
    if (this.responded) throw new Error("Interaction already acknowledged. Cannot acknowledge more than once.");

    await this.client.rest.api
      .interactions(this.id)(this.token).callback.post({
        data: {
          type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          data: { flags: ephemeral ? 64 : 0 }
        }
      });

    return (this.responded = true, await this.getMessage());
  }

  /**
    * Creates a followup response for this interaction.
    * This interaction must have been responded in order to create a followup.
    * @param {InteractionMessageCreateOptions} options The options to be used when creating the response
    * @returns {Promise}
    */
  async createFollowup (options) {
    if (!this.responded) throw new Error("This interaction has not been responded yet. You must respond it before creating a followup message.");

    if (typeof (options) === "string") options = { content: String(options) };

    if (options.ephemeral) {
      options.flags |= 64;

      delete options.ephemeral;
    }

    const response = await this.client.rest.api
      .webhooks(this.applicationId)(this.token).post({ data: options });

    return new Message(response, this.client);
  }

  /**
    * Deletes one of the responses sent by this interaction
    * @param {string} messageId The message to be deleted.
    * @returns {Promise}
    */
  async delete (messageId = "@original") {
    if (!this.responded) throw new Error("This interaction has not been responded yet. You must respond it before deleting the response.");

    return await this.client.rest.api
      .webhooks(this.applicationId)(this.token).messages(messageId).delete();
  }

  /**
    * Edits one of the responses sent by this interaction
    * @param {MessageEditOptions | string} options The options to be used when editing the response.
    * @param {string} messageId The message to be edited.
    * @returns {Promise}
    */
  async editReply (options, messageId = "@original") {
    if (!this.responded) throw new Error("This interaction has not been responded yet. You must respond it before editing the response.");

    if (typeof (options) === "string") options = { content: String(options) };

    return await this.client.rest.api
      .webhooks(this.applicationId)(this.token).messages(messageId).patch({ data: options });
  }

  /**
    * Fetch a message that was sent by this interaction.
    * @param {string} messageId The message to be fetched.
    * @returns {Promise<Message>}
    */
  async getMessage (messageId = "@original") {
    const messagePayload = await this.client.rest.api
      .webhooks(this.applicationId)(this.token).messages(messageId)
      .get();

    return new Message(messagePayload, this.client);
  }
}

module.exports = Interaction;
