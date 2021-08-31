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

    /**
     * Whether this user is a bot or not
     * @type {Boolean}
     */
    this.bot = data.bot ?? true;

    if ("username" in data) {
      /**
       * The username of this user
       * @type {String}
       */
      this.username = data.username;
    }

    if ("avatar" in data) {
      /**
       * The avatar hash of this user
       * @type {String}
       */
      this.avatarHash = data.avatar;
    }

    if ("premium_type" in data) {
      /**
       * The type of Nitro subscription this user has
       * 0 = No subscription
       * 1 = Nitro Classic
       * 2 = Nitro
       * @type {Number}
       */
      this.premiumType = data.premium_type ?? 0;
    }

    if ("flags" in data) {
      /**
       * This user flags
       * @type {Number}
       */
      this.flags = data.flags ?? 0;
    }
  }
}

module.exports = User;
