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

    this._update(data);
  }

  _update (data) {
    return data;
  }
}

module.exports = Role;
