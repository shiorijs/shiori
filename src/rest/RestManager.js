const axios = require("axios");
const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const Constants = require("../utils/Constants");
const Collection = require("../utils/Collection");

/**
  * Manages all requests.
  */
class RestManager {
  /**
   * @param {Client} client Hitomi Client
   */
  constructor (client) {
    /**
     * The base hitomi client.
     * @name RestManager#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, "client", { value: client });

    /**
     * User Agent to be used on request headers.
     * @type {String}
     */
    this.userAgent = `Hitomi (https://github.com/IsisDiscord/hitomi, ${require("../../package.json").version})`;

    // TODO: Fazer com que o usuário escolha a versão.
    /**
     * API Url to be used on requests.
     * @type {String}
     */
    this.apiURL = `${Constants.REST.BASE_URL}/v9`;

    /**
     * Handlers to be used as bucket identifier.
     * @type {Collection<String, Bucket>}
     */
    this.handlers = new Collection();
  };

  /**
   * Build the api route
   * @returns {buildRoute}
   */
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
   * Formats the request data to a usable format for axios
   * @param request The request data
   */
  #resolveRequest(url, method, options) {
    const headers = { "User-Agent": this.userAgent, "Content-Type": "application/json" };

    if (options.authenticate === undefined) options.authenticate = true;
    if (options.authenticate) headers.Authorization = `Bot ${this.client.token}`;

    if (options.data?.reason !== undefined) {
      headers["X-Audit-Log-Reason"] = options.data.reason;
      delete options.data.reason;
    }

    const formatedUrl = `${this.apiURL}/${url.replace(/[/]?(\w+)/, '$1')}`;

    const requestOptions = { data: options.data, method: method.toLowerCase(), headers };

    return { formatedUrl, requestOptions };
  }

  /**
   * Formats the url to be used as a bucket identifier
   * @param {String} url The request URL
   * @returns {String}
   */
  routefy(url) {
    if (!/channels|guilds|webhooks/.test(url)) url = url.replace(/\d{16,18}/g, ":id")

    return url
      .replace(/\/reactions\/[^/]+/g, "/reactions/:id")
      .replace(/\/reactions\/:id\/[^/]+/g, "/reactions/:id/:userID");
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

module.exports = RestManager;
