const Base = require("./Base");
const User = require("./User");

class Member extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the guild member
   * @param {Guild} guild The guild the member is part of
   */
  constructor (data, client, guild) {
    super(client);

    // TODO: Mudar isso para um ID e fazer isso um getter.
    /**
     * Guild this member belongs to
     * @type {Guild}
     */
    this.guild = guild;

    /*
    Vale apena colocar a propriedade user na classe membro?
    Podemos colocar algumas propriedades, como id e username

    Caso seja necessário, podemos fazer isso ser um getter.
    */

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
       * @type {String}
       */
      this.nickname = data.nick;
    }

    if ("roles" in data) {
      /**
       * All of the member roles in a guild
       * @type {Array<Snowflake>}
       */
      this.roles = data.roles;
    }

    if ("joined_at" in data) {
      /**
       * When this member joined a guild
       * @type {Date}
       */
      this.joinedAt = new Date(data.joined_at);
    }

    if ("permissions" in data) {
      /**
       * Permissions of the member in a guild
       * @type {String}
       */
      this.permissions = data.permissions;
    }
  }
}

module.exports = Member;
