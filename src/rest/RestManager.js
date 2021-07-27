const axios = require("axios");

const URL = `https://discord.com/api/v8`

module.exports = class RestManager {
  constructor (client) {
    this.client = client;
    this.userAgent = `Discord (https://github.com/IsisDiscord/hitomi)`;
  };

  /**
   * Make an HTTP request to the Discord API
   * @param {String} method The HTTP method to use
   * @param {String} url URL to make the request to
   * @param {Object} data The data to be sent
   * @param {Boolean} authenticate Whether to authenticate the request
   */
  async request(method, url, data, authenticate) {
    let headers = {
      "User-Agent": this.userAgent,
      "Content-Type": "application/json"
    };

    if (authenticate) headers.Authorization = this.client.token;

    return axios({
      method,
      url: `${URL}${url.startsWith("/") ? url : `/${url}`}`,
      headers,
      data
    });
  }
};
