const User = require("../structures/User");
const Endpoints = require("../rest/Endpoints");
const Cache = require("./Cache");

class UsersCache extends Cache {
  #client;

  constructor (client) {
    super(client.options.cache.users, User);
    this.#client = client;
  }

  async fetch (userId) {
    return await this.#client.rest.request("get", Endpoints.USER(userId));
  }
}

module.exports = UsersCache;
