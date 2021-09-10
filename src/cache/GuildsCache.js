const Guild = require("../structures/Guild");
const Endpoints = require("../rest/Endpoints");
const LimitedCache = require("./LimitedCache");

class GuildsCache extends LimitedCache {
  #client;

  constructor (client) {
    super(client.options.cache.guilds, Guild);
    this.#client = client;
  }

  async fetch (userId) {
    return await this.#client.rest.request("get", Endpoints.USER(userId));
  }
};

module.exports = GuildsCache;
