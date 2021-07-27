const EventEmitter = require("events");
const { Collection } = require('../');

module.exports = class Client extends EventEmitter {
  constructor (token, clientOptions) {
    super();

    this.options = Object.assign({

    }, clientOptions);

    this.users = new Collection();
    this.guilds = new Collection();
    this.channels = new Collection();

    Object.defineProperty(this, "token", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: token
    });
  }

  async start() {

  };

  /** 
   * @param {String} id ID of an user, role, channel or guild to fetch
   * @param {String} type Type of the structure to fetch, user, role, channel or guild
  */
  async fetchInfo(id, type) {
    const url = "";

    return this.api.request("GET", url, null, true);
  };
};
