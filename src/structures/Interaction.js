const Base = require("./Base");
const { InteractionTypes } = require("../utils/Constants");

/**
 * Represents a interaction on Discord.
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
      * Whether this interaction was already responded.
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

    this._update(data);
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
       * The user which sent this interaction
       * @type {User}
       */
      this.user = this.client.users.add(data.user.id, data.user);
    }

    if ("member" in data) {
      /**
       * If this interaction was sent in a guild, the member which sent it
       * @type {Member}
       */
      this.member = this.guild?.members.add(data.member) ?? data.member;
    }
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
    * Acknowledges the interaction with a defer response
    * Note: You can **not** use more than 1 initial interaction response per interaction.
    * @arg {number} [flags] 64 for Ephemeral
    * @returns {Promise}
    */
  acknowledge () {
    if (this.acknowledged) throw new Error("Interaction already acknowledged. Cannot acknowledge more than once");

    return this.client.rest.api;
  }
}

module.exports = Interaction;
