const Base = require("./Base");

/**
 * Represents a guild role.
 * @extends {Base}
 */
class Role extends Base {
  /**
   * @param {object} data The role structure data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(client);

    /**
     * The role id
     * @type {string}
     */
    this.id = data.id;

    /**
      * Whether the role is managed by an integration
      * @type {boolean}
      */
    this.managed = data.managed;

    /**
     * Reference object that contains the tags a role has
     * @typedef {object} RoleTags
     * @property {string} botId The id of the bot this role belongs to
     * @property {string} integrationId The id of the integration this role belongs to
     * @property {null} premiumSubscriber Whether this is the guild's premium subscriber role
     */

    if ("tags" in data) {
      /**
       * The role tags
       * @type {RoleTags}
       */
      this.tags = {
        botId: data.tags.bot_id,
        integrationId: data.tags.integration_id,
        premiumSubscriber: data.tags.premium_subscriber
      };
    }

    this._update(data);
  }

  _update (data) {
    if ("name" in data) {
      /**
       * The role name
       * @type {string}
       */
      this.name = data.name;
    }

    if ("color" in data) {
      /**
       * The role hexadecimal color code
       * @type {integer}
       */
      this.color = data.color;
    }

    if ("hoist" in data) {
      /**
       * Whether the role is pinned in the user listing
       * @type {boolean}
       */
      this.hoisted = data.hoist;
    }

    if ("position" in data) {
      /**
       * The role position
       * @type {number}
       */
      this.position = data.position;
    }

    if ("mentionable" in data) {
      /**
       * Whether the role is mentionable
       * @type {boolean}
       */
      this.mentionable = data.mentionable;
    }

    if ("permissions" in data) {
      /**
       * The role permission bit set
       * @type {string}
       */
      this.permissions = data.permissions;
    }

    return data;
  }
}

module.exports = Role;
