const Base = require("./Base");
const User = require("./User");

module.exports = class Member extends Base {
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
       * @type {String}
       */
      this.nickname = data.nick;
    }

    if ("roles" in data) {
      /**
       * All of the member roles
       * @type {String}
       */
      this.roles = data.roles;
    }

    if ("joined_at" in data) {
      /**
       * When this user joined the guild
       * @type {String}
       */
      this.joined_at = new Date(data.joined_at);
    }

    if ("permissions" in data) {
      /**
       * Permissions of this member in this guild
       * @type {String}
       */
      this.permissions = data.permissions;
    }
  }
};
