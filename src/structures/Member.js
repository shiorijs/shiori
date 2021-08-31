const Base = require("./Base");
const User = require("./User");

class Member extends Base {
  /**
   * @param {object} data The data for the guild member
   * @param {Client} client The instantiating client
   * @param {Guild} guild The guild the member is part of
   */
  constructor (data, client, guild) {
    super(client);

    /**
     * Guild this member belongs to
     * @type {Guild}
     */
    this.guild = guild;

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
       * User ID
       * @type {string}
       */
      this.nickname = data.nick;
    }

    if ("roles" in data) {
      /**
       * All of the member roles
       * @type {string}
       */
      this.roles = data.roles;
    }

    if ("joined_at" in data) {
      /**
       * When this user joined the guild
       * @type {string}
       */
      this.joinedAt = new Date(data.joined_at);
    }

    if ("permissions" in data) {
      /**
       * Permissions of this member in this guild
       * @type {string}
       */
      this.permissions = data.permissions;
    }
  }
}

module.exports = Member;
