const { InteractionTypes, InteractionResponseTypes } = require("../../utils/Constants");

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
     * The interaction's id
     * @type {string}
     */
    this.id = data.id;

    /**
      * The interaction's type
      * @type {string}
      */
    this.type = InteractionTypes[data.type] ?? "UNKNOWN";

    /**
      * Whether this interaction has been responded.
      * @type {boolean}
      */
    this.responded = false;

    /**
     * The interaction's token
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
       * The userId which sent this interaction
       * @type {string}
       */
      this.userId = data.user.id;
    }

    if ("member" in data) {
      /**
       * If this interaction was sent in a guild, the member which sent it
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
   * The channel this interaction was sent in
   * @type {?TextChannel}
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
   * The user that send this interaction
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
    if (this.responded) return await this.createFollowup(options, options.ephemeral);

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
    * Responds to the interaction with a defer response
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
    * Creates a followup message for this interaction.
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
    * Deletes this interaction response
    * @param {string} messageId The message to be deleted.
    * @returns {Promise}
    */
  async delete (messageId = "@original") {
    if (!this.responded) throw new Error("This interaction has not been responded yet. You must respond it before deleting the response.");

    return await this.client.rest.api
      .webhooks(this.applicationId)(this.token).messages(messageId).delete();
  }

  /**
    * Edits the interaction response
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

  async getMessage (messageId = "@original") {
    const messagePayload = await this.client.rest.api
      .webhooks(this.applicationId)(this.token).messages(messageId)
      .get();

    return new Message(messagePayload, this.client);
  }
}

module.exports = Interaction;
