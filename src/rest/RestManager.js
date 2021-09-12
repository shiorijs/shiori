const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const LimitedCollection = require("../utils/LimitedCollection");

/**
  * Manages all requests.
  */
class RestManager {
  #handlers;

  /**
   * @param {Client} client Shiori Client
   * @param {RestOptions} options Options to be used when creating requests.
   */
  constructor (client, options) {
    this.options = options;

    /**
     * The base hitomi client.
     * @name RestManager#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, "client", { value: client });

    /**
     * Collection used to store buckets.
     * @type {LimitedCollection<string, Bucket>}
     */
    this.#handlers = new LimitedCollection({
      toAdd: () => true,
      toRemove: (bucket) => bucket.inactive,
      limit: Infinity,
      sweep: 10,
      sweepTimeout: 600000
    }, Bucket);

    /**
     * User Agent to be used on request headers.
     * @type {string}
     */
    this.userAgent = `Shiori (https://github.com/shiorijs/shiori, ${require("../../package.json").version})`;

    /**
     * API Url to be used on requests.
     * @type {string}
     */
    this.apiURL = `/api/v${this.options.version}`;
  }

  /**
   * Set the token that will be used to create the HTTP requests
   * @param {string} token The token to be used
   * @returns {void}
   */
  setToken (token) {
    this.token = token;
  }

  /**
   * Build the api route
   * @type {buildRoute}
   * @readonly
   */
  get api () {
    return buildRoute(this);
  }

  /**
   * Make an HTTP request to the Discord API
   * @param {string} method The HTTP method to use
   * @param {string} url URL to make the request to
   * @param {object} [options] The options to use on the request
   * @param {object} [options.data] The data to be sent
   * @param {boolean} [options.authenticate] Whether to authenticate the request
   */
  request (method, url, options = {}) {
    const route = this.routefy(url);

    if (!this.#handlers.has(route)) this.#handlers.add(route, this);

    const { requestOptions, formattedUrl } = this.#resolveRequest(url, method, options);

    return this.#handlers.get(route).queueRequest(formattedUrl, requestOptions, route);
  }

  /**
   * Formats the request data to a usable format for https
   * @param request The request data
   */
  #resolveRequest (url, method, options) {
    const headers = { "User-Agent": this.userAgent, "Content-Type": "application/json" };

    if (options.authenticate === undefined) options.authenticate = true;
    if (options.authenticate) headers.Authorization = `Bot ${this.token}`;

    if (options.data?.reason !== undefined) {
      headers["X-Audit-Log-Reason"] = options.data.reason;
      delete options.data.reason;
    }

    const formattedUrl = `${this.apiURL}/${url.replace(/[/]?(\w+)/, "$1")}`;

    const requestOptions = {
      hostname: "discord.com",
      data: options.data,
      timeout: this.client.rest.options.timeout,
      method,
      headers
    };

    return { formattedUrl, requestOptions };
  }

  /**
   * Formats the url to be used as a bucket identifier
   * @param {string} url The request URL
   * @returns {string}
   */
  routefy (url) {
    if (!/channels|guilds|webhooks/.test(url)) url = url.replace(/\d{16,18}/g, ":id");

    return url
      .replace(/\/reactions\/[^/]+/g, "/reactions/:id")
      .replace(/\/reactions\/:id\/[^/]+/g, "/reactions/:id/:userID");
  }
}

// Based on discord.js api router method.
function buildRoute (manager) {
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
  };

  return new Proxy(emptyFunction, handler);
}

module.exports = RestManager;
