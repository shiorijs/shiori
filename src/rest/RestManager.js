const axios = require("axios");

const Constants = require("../utils/Constants");

module.exports = class RestManager {
  constructor (client) {
    this.client = client;
    this.userAgent = `Hitomi (https://github.com/IsisDiscord/hitomi, ${require("../../package.json").version})`;

    this.apiURL = `${Constants.REST.BASE_URL}${this.client.options.rest.version}`;
  };

  /**
   * Make an HTTP request to the Discord API
   * @param {String} [method] The HTTP method to use
   * @param {String} [url] URL to make the request to
   * @param {Object} [data] The data to be sent
   * @param {Boolean | undefined} [authenticate] Whether to authenticate the request
   */
  async request(method, url, data, authenticate = true) {
    const headers = {
      "User-Agent": this.userAgent,
      "Content-Type": "application/json"
    };

    if (authenticate) headers.Authorization = `Bot ${this.client.token}`;

    return axios[method.toLowerCase()](`${this.apiURL}/${url.replace(/[/]?(\w+)/, '$1')}`, { headers, data });
  }
};
