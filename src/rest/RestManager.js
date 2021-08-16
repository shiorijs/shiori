const axios = require("axios");
const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const Constants = require("../utils/Constants");

module.exports = class RestManager {
  #requestQueue;

  constructor (client) {
    this.client = client;
    this.userAgent = `Hitomi (https://github.com/IsisDiscord/hitomi, ${require("../../package.json").version})`;

    // TODO: Fazer com que o usuário escolha.
    this.apiURL = `${Constants.REST.BASE_URL}/v9`;

    this.api = buildRoute(this);
    this.ratelimits = {};
    this.globalBlocked = false;
    this.#requestQueue = [];
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

    if (!this.ratelimits[route]) this.ratelimits[route] = new Bucket();
    const queue = () => this.ratelimits[route].queue(() => this.#make(method, url, options || {}, route));

    return (this.globalBlocked && options.authenticate) ? this.#requestQueue.push(() => queue()) : queue();
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

    if (options.authenticate === undefined) options.authenticate = true;

    if (options?.authenticate) headers.Authorization = `Bot ${this.client.token}`;
    if (options?.data?.reason !== undefined) {
      headers["X-Audit-Log-Reason"] = options.data.reason;
      delete options.data.reason;
    }

    const result = await axios({
      url: `${this.apiURL}/${url.replace(/[/]?(\w+)/, '$1')}`,
      method: method.toLowerCase(),
      data: options.data,
      headers
    }).catch(error => {
      const response = error.response.data;
      if (response.message.includes("rate limited")) {
        const prefix = response.global ? "global" : "local";

        return this.client.emit(
          "error", `You are being ${prefix} ratelimited. Wait ${response.retry_after} seconds before making another request.`
        );
      }
    });

    if (!result || result.headers == undefined) return;

    if (result.headers["x-ratelimit-limit"])
      this.ratelimits[route].limit = Number(result.headers["x-ratelimit-limit"]);

    this.ratelimits[route].remaining = Number(result.headers["x-ratelimit-remaining"]);

    const retryAfter = parseInt(result.headers["retry-after"]) * 1000;

    if (retryAfter > 0 || result.status === 429) {
      this.client.emit("warn", `
        Rate-Limit hit on route "${route}"
        Global: ${Boolean(result.headers["x-ratelimit-global"])}
        Requests: ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left
        Reset ${this.ratelimits[route].resetAfter} (ms)
      `)

      if (result.headers["x-ratelimit-global"]) {
        this.globalBlocked = true;
        setTimeout(() => this.globalUnblock(), retryAfter);
      } else this.ratelimits[route].resetAfter = retryAfter + Date.now();
    } else this.ratelimits[route].resetAfter = Date.now();

    return result.data || undefined;
  }

  globalUnblock() {
    this.globalBlocked = false;

    while (this.#requestQueue.length) this.#requestQueue.shift()();
  }

  routefy(url) {
    if (!/channels|guilds|webhooks/.test(url)) url = url.replace(/\d{16,18}/g, ":id")

    url = url
      .replace(/\/reactions\/[^/]+/g, "/reactions/:id")
      .replace(/\/reactions\/:id\/[^/]+/g, "/reactions/:id/:userID");

    return url;
  }
};

function buildRoute(manager) {
  const route = [""];
  const emptyFunction = () => { };

  const handler = {
    get (_, method) {
      if (METHODS.includes(method)) {
        return (options) =>
          manager.request(method, route.join("/"), options);
      }

      route.push(method);
      return new Proxy(emptyFunction, handler);
    },
    apply (_target, _, args) {
      route.push(...args.filter(Boolean));

      return new Proxy(emptyFunction, handler);
    }
  }

  return new Proxy(emptyFunction, handler);
}
