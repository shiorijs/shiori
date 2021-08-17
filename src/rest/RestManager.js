const axios = require("axios");
const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const Constants = require("../utils/Constants");
const Collection = require("../utils/Collection");

module.exports = class RestManager {
  constructor (client) {
    this.client = client;
    this.userAgent = `Hitomi (https://github.com/IsisDiscord/hitomi, ${require("../../package.json").version})`;

    // TODO: Fazer com que o usuário escolha.
    this.apiURL = `${Constants.REST.BASE_URL}/v9`;

    this.handlers = new Collection();
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
  async request (method, url, options = {}) {
    const route = this.routefy(url);

    if (!this.handlers.has(route)) this.handlers.add(route, new Bucket(this));

    const { requestOptions, formatedUrl } = this.#resolveRequest(url, method, options);
    
    return this.handlers.get(route).queueRequest(formatedUrl, requestOptions, route);
  }

  /**
   * Formats the request data to a usable format for fetch
   * @param request The request data
   */
  #resolveRequest(url, method, options) {
    const headers = { "User-Agent": this.userAgent, "Content-Type": "application/json" };

    if (options.authenticate === undefined) options.authenticate = true;
    if (options?.authenticate) headers.Authorization = `Bot ${this.client.token}`;

    if (options?.data.reason !== undefined) {
      headers["X-Audit-Log-Reason"] = options.data.reason;
      delete options.data.reason;
    }

    const formatedUrl = `${this.apiURL}/${url.replace(/[/]?(\w+)/, '$1')}`;

    const requestOptions = { data: options.data, method: method.toLowerCase(), headers };

    return { formatedUrl, requestOptions };
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
