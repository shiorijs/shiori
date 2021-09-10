const Guild = require("../structures/Guild");
const Endpoints = require("../rest/Endpoints");
const Cache = require("./Cache");

/**
 * Represents the Guilds Cache Manager.
 * @extends {Cache}
 */
class GuildsCache extends Cache {
  #client;

  /**
   * @param {Client} client The instantiating client
   */
  constructor (client) {
    super(client.options.cache.guilds, Guild);
    this.#client = client;
  }

  /**
    * Makes a HTTP request in order to fetch the guild
    * @param {string} guildId The guild id to fetch
    * @returns {Guild}
    */
  async fetch (guildId) {
    return await this.#client.rest.request("get", Endpoints.USER(guildId));
  }
}

module.exports = GuildsCache;
