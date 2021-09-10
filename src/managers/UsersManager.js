const CachedManager = require("./CachedManager");

module.exports = class UsersManager extends CachedManager {
  #client;

  constructor (client) {
    super("users", client.options.cache.users);
    this.#client = client;
  }
};
