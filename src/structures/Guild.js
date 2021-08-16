const Base = require("./Base");
const Collection = require("../utils/Collection");
const Member = require("./Member");

/**
  * Represents a discord guild
  * @extends {Base}
  */
class Guild extends Base {
  /**
   * @param {Client} client Hitomi Client
   * @param {Object} data The guild structure data
   */
  constructor (data, client) {
    super(client);

    /**
     * The members that are in this guild
     * @type {Collcection<String, Member>}
     */
    this.members = new Collection(Member);

    this._update(data);
  }

  _update (data) {
    /**
     * Guild ID
     * @type {String}
     */
    this.id = data.id;

    if (data.username) {
      /**
       * The username that belongs to this user
       * @type {String}
       */
      this.username = data.username;
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
       * The type of Nitro subscription on a user's account
       * 0 = No subscription
       * 1 = Nitro Classic
       * 2 = Nitro
       * @type {Number}
       */
      this.premiumType = data.premium_type ?? 0;
    }

    if (data.flags) {
      /**
       * The author flags
       * @type {Number}
       */
      this.flags = data.flags ?? 0;
    }
  }
};

module.exports = Guild;
