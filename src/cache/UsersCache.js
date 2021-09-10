const User = require("../structures/User");
const Endpoints = require("../rest/Endpoints");
const LimitedCache = require("./LimitedCache");

class UsersCache extends LimitedCache {
  #client;

  constructor (client) {
    super(client.options.cache.users, User);
    this.#client = client;
  }

  async fetch (userId) {
    return await this.#client.rest.request("get", Endpoints.USER(userId));
  }
};

module.exports = UsersCache;
