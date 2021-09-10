const Guild = require("../structures/Guild");
const Endpoints = require("../rest/Endpoints");
const Cache = require("./Cache");

class GuildsCache extends Cache {
  #client;

  constructor (client) {
    super(client.options.cache.guilds, Guild);
    this.#client = client;
  }

  async fetch (userId) {
    return await this.#client.rest.request("get", Endpoints.USER(userId));
  }
}

module.exports = GuildsCache;
