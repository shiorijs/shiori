const Base = require("./Base");
const { InteractionTypes } = require("../utils/Constants");

/**
 * Represents a interaction on Discord.
 * @extends {Base}
 */
class Interaction extends Base {
  constructor (data, client) {
    super(client);

    /**
     * The interaction's id
     * @type {String}
     */
    this.id = data.id;
    
    /**
      * The interaction's type
      * @type {String}
      */
    this.type = InteractionTypes[data.type] ?? "UNKNOWN";

    /**
     * The interaction's token
     * @type {string}
     * @name Interaction#token
     * @readonly
     */
    Object.defineProperty(this, 'token', { value: data.token });

    this._update(data);
  }

  _update (data) {
    if (data.application_id) {
      /**
       * The application's id
       * @type {String}
       */
      this.applicationId = data.application_id;
    }

    if (data.channel_id) {
      /**
       * The id of the channel this interaction was sent in
       * @type {String}
       */
      this.channelId = data.channel_id;
    }

    if (data.guild_id) {
      /**
       * The id of the guild this interaction was sent in
       * @type {String}
       */
      this.guildId = data.guild_id;
    }

    if (data.user) {
      /**
       * The user which sent this interaction
       * @type {User}
       */
      this.user = this.client.users.add(data.user.id, data.user);
    }

    if (data.member) {
      /**
       * If this interaction was sent in a guild, the member which sent it
       * @type {Member}
       */
      this.member = this.guild?.members.add(data.member) ?? data.member;
    }

    if (data.version) {
      /**
       * The version
       * @type {Number}
       */
      this.version = data.version;
    }
  }

  /**
   * The channel this interaction was sent in
   * @type {?TextChannel}
   * @readonly
   */
  get channel() {
    return this.client.getChannel(this.channelId) ?? null;
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
    * @arg {Number} [flags] 64 for Ephemeral
    * @returns {Promise}
    */
  async acknowledge (flags) {
    if (this.acknowledged) throw new Error("Interaction already acknowledged. Cannot acknowledge more than once");

    return this.client.rest.api;
  }
}

module.exports = Interaction;
