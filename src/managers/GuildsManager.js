const Guild = require("../structures/Guild");
const Endpoints = require("../rest/Endpoints");
const LimitedManager = require("./LimitedManager");

module.exports = class GuildsManager extends LimitedManager {
  #client;

  constructor (client) {
    super(client.options.cache.guilds, Guild);
    this.#client = client;
  }

  async fetch (userId) {
    return await this.#client.rest.request("get", Endpoints.USER(userId));
  }
};
