const User = require("../structures/User");
const Endpoints = require("../rest/Endpoints");
const Cache = require("./Cache");

/**
 * Represents the Users Cache Manager.
 * @extends {Cache}
 */
class UsersCache extends Cache {
  #client;

  /**
   * @param {Client} client The instantiating client
   */
  constructor (client) {
    super(client.options.cache.users, User);
    this.#client = client;
  }

  /**
    * Makes a HTTP request in order to fetch the user
    * @param {string} userId The user id to fetch
    * @returns {User}
    */
  async fetch (userId) {
    return await this.#client.rest.request("get", Endpoints.USER(userId));
  }
}

module.exports = UsersCache;
