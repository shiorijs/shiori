const axios = require("axios");
const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const Constants = require("../utils/Constants");

module.exports = class RestManager {
  constructor (client) {
    this.client = client;
    this.userAgent = `Hitomi (https://github.com/IsisDiscord/hitomi, ${require("../../package.json").version})`;

    // Fazer com que o usuário escolha.
    this.apiURL = `${Constants.REST.BASE_URL}/v9`;

    this.api = buildRoute(this);
    this.ratelimits = {};
  };

  /**
   * Make an HTTP request to the Discord API
   * @param {String} method The HTTP method to use
   * @param {String} url URL to make the request to
   * @param {Object} [options] The options to use on the request
   * @param {Object} [options.data] The data to be sent
   * @param {Boolean} [options.authenticate] Whether to authenticate the request
   */
  async request(method, url, options) {
    const route = this.routefy(url);

    console.log(route)
    /*

    if (!this.ratelimits[route]) this.ratelimits[route] = new Bucket();

    this.ratelimits[route].queue(() => this.#make(method, url, options, route));*/
  }

  /**
   * Handle the HTTP request to the discord API.
   * This method is private because it doesn't handle ratelimits alone. Use RestManager#request(...)
   * @param {String} method The HTTP method to use
   * @param {String} url URL to make the request to
   * @param {Object} [options] The options to use on the request
   * @param {Object} [options.data] The data to be sent
   * @param {Boolean} [options.authenticate] Whether to authenticate the request
   * @param {String} route The cleaned route. Used for ratelimit identifying
   */
  async #make(method, url, options, route) {
    const headers = {
      "User-Agent": this.userAgent,
      "Content-Type": "application/json"
    };

    if (options.authenticate) headers.Authorization = `Bot ${this.client.token}`;
    if (options.data?.reason !== undefined) {
      headers["X-Audit-Log-Reason"] = options.data.reason;
      delete options.data.reason;
    }

    const result = await axios({
      url: `${this.apiURL}/${url.replace(/[/]?(\w+)/, '$1')}`,
      method: method.toLowerCase(),
      data: options.data,
      headers
    });

    if (!result || result.headers == undefined) return;

    if (this.ratelimits[route].limit === 1)
      this.ratelimits[route].limit = result.headers["x-ratelimit-limit"];

    this.ratelimits[route].remaining = Number(result.headers["x-ratelimit-remaining"]);
    this.ratelimits[route].resetAfter = Number(result.headers["x-ratelimit-reset-after"]) * 1000;
  }

  routefy(url) {
    if (!/channels|guilds|webhooks/.test(url)) url = url.replace(/\d{17,19}/g, ":id")

    url = url
      .replace(/\/reactions\/[^/]+/g, "/reactions/:id")
      .replace(/\/reactions\/:id\/[^/]+/g, "/reactions/:id/:userID");

    return url;
  }
};

function buildRoute(manager, route = "/") {
  return new Proxy({}, {
    get(_, method) {
       if (method === 'toString') return () => route;

       if (METHODS.includes(method)) {
         return options =>
           manager.request(
             method,
             route.substring(0, route.length - 1),
             options
           );
       }

       return buildRoute(manager, route + method + '/');
     }
  })
}
