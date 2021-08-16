const axios = require("axios");
const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const Constants = require("../utils/Constants");

function getAPIOffset(serverDate) {
  return new Date(serverDate).getTime() - Date.now();
}

function calculateReset(reset, serverDate) {
  return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate);
}

module.exports = class RestManager {
  constructor (client) {
    this.client = client;
    this.userAgent = `Hitomi (https://github.com/IsisDiscord/hitomi, ${require("../../package.json").version})`;

    // TODO: Fazer com que o usuário escolha.
    this.apiURL = `${Constants.REST.BASE_URL}/v9`;

    this.ratelimits = {};
  };

  get api () {
    return buildRoute(this);
  }

  /**
   * Make an HTTP request to the Discord API
   * @param {String} method The HTTP method to use
   * @param {String} url URL to make the request to
   * @param {Object} [options] The options to use on the request
   * @param {Object} [options.data] The data to be sent
   * @param {Boolean} [options.authenticate] Whether to authenticate the request
   */
  async request(method, url, options = {}) {
    const route = this.routefy(url);

    if (options.authenticate === undefined) options.authenticate = true;

    if (!this.ratelimits[route]) this.ratelimits[route] = new Bucket();

    return this.ratelimits[route].queue(() => this.#make(method, url, options, route))
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
    const headers = { "User-Agent": this.userAgent, "Content-Type": "application/json" };

    if (options?.authenticate) headers.Authorization = `Bot ${this.client.token}`;
    if (options?.data.reason !== undefined) {
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

    const serverDate = result.headers['date'];
    const remaining = result.headers['x-ratelimit-remaining'];
    const limit = result.headers['x-ratelimit-limit'];
    const reset = result.headers['x-ratelimit-reset'];

    this.ratelimits[route].remaining = remaining !== null ? Number(remaining) : 1;
    this.ratelimits[route].reset = reset !== null
      ? calculateReset(reset, serverDate)
      : Date.now();

    if (route.includes("reactions")) {
      this.ratelimits[route].reset = new Date(serverDate).getTime() - getAPIOffset(serverDate) + 250;
    }

    const retryAfter = Number(result.headers["retry-after"]) * 1000 ?? -1;

    if (retryAfter > 0) {
      if (result.headers["x-ratelimit-global"]) {
        this.ratelimits[route].globalBlocked = true;
        this.ratelimits[route].globalReset = Date.now() + retryAfter;
      } else {
        this.ratelimits[route].reset = retryAfter;
      }
    }

    if (result.status === 429) {
      this.client.emit("warn", `
        Rate-Limit hit on route "${route}"
        Global: ${Boolean(result.headers["x-ratelimit-global"])}
        Requests: ${this.ratelimits[route].remaining}/${limit} left
        Reset ${this.ratelimits[route].reset}
      `);
    }

    return result.data || undefined;
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
  const route = [];
  const emptyFunction = () => {};

  const handler = {
    get (_, method) {
      if (METHODS.includes(method)) {
        return (options) => manager.request(method, route.join("/"), options);
      }

      route.push(method);
      return new Proxy(emptyFunction, handler);
    },
    apply (_target, _, args) {
      route.push(...args);

      return new Proxy(emptyFunction, handler);
    }
  }

  return new Proxy(emptyFunction, handler);
}
