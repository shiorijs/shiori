const Base = require("./Base");
const User = require("./User");

class Member extends Base {
  /**
   * @param {object} data The data for the guild member
   * @param {Client} client The instantiating client
   * @param {string} guildId The guildId the member is part of
   */
  constructor (data, client, guildId) {
    super(client);

    /**
     * guildId this member belongs to
     * @type {string}
     */
    this.guildId = guildId;

    // Provavelmente mudar isso para um getter
    /**
     * The user object this member belongs to
     * @type {User}
     */
    this.user = this.client.users.get(data.user.id);

    if (!this.user) this.user = new User(data.user, client);

    this._update(data);
  }

  _update (data) {
    if ("nick" in data) {
      /**
       * Member nickname in a guild
       * @type {string}
       */
      this.nickname = data.nick;
    }

    if ("roles" in data) {
      /**
       * All of the member roles in a guild
       * @type {string}
       */
      this.roles = data.roles;
    }

    if ("joined_at" in data) {
      /**
       * When the member joined a guild
       * @type {Date}
       */
      this.joinedAt = new Date(data.joined_at);
    }

    if ("permissions" in data) {
      /**
       * Permissions of the member in a guild
       * @type {string}
       */
      this.permissions = data.permissions;
    }
  }

  /**
   * The guild this member belongs to
   * @type {?Guild}
   * @readonly
   */
  get guild () {
    return this.client.guilds.get(this.guildId) ?? null;
  }
}

module.exports = Member;
