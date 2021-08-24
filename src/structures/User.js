const Base = require("./Base");

/**
  * Represents a discord user
  * @extends {Base}
  */
class User extends Base {
  /**
   * @param {Client} client Shiori Client
   * @param {Object} data The user structure data
   */
  constructor (data, client) {
    super(client);

    this._update(data);
  }

  _update (data) {
    /**
     * User ID
     * @type {String}
     */
    this.id = data.id;

    if (data.username) {
      /**
       * The username of this user
       * @type {String}
       */
      this.username = data.username;
    }

    if (data.avatar) {
      /**
       * The avatar of this user
       * @type {String}
       */
      this.avatarHash = data.avatar;
    }

    if (data.bot !== undefined) {
      /**
       * Whether this user is a bot or not
       * @type {Boolean}
       */
      this.bot = data.bot;
    }

    if (data.premium_type) {
      /**
       * The type of Nitro subscription this user has
       * 0 = No subscription
       * 1 = Nitro Classic
       * 2 = Nitro
       * @type {Number}
       */
      this.premiumType = data.premium_type ?? 0;
    }

    if (data.flags) {
      /**
       * This user flags
       * @type {Number}
       */
      this.flags = data.flags ?? 0;
    }
  }
}

module.exports = User;
