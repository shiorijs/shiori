const METHODS = ["get", "post", "patch", "put", "delete", "head"];

const Bucket = require("./Bucket");
const Constants = require("../utils/Constants");
const Collection = require("../utils/Collection");

/**
  * Manages all requests.
  */
class RestManager {
  /**
   * @param {Client} client Shiori Client
   * @param {object} [options={}] Options to be used when creating requests.
   * @param {string} [options.version] Discord API version
   * @param {boolean} [options.fetchAllUsers] Whether to get all users. Guild Members intent required
   */
  constructor (client, options = {}) {
    this.options = Object.assign({
      version: Constants.REST.API_VERSION,
      fetchAllUsers: false
    }, options.rest);

    /**
     * The base hitomi client.
     * @name RestManager#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, "client", { value: client });

    /**
     * Handlers used to store buckets.
     * @name RestManager#handlers
     * @type {Collection<string, Bucket>}
     */
    Object.defineProperty(this, "handlers", { value: new Collection() });

    /**
     * User Agent to be used on request headers.
     * @type {string}
     */
    this.userAgent = `Shiori (https://github.com/shiorijs/shiori, ${require("../../package.json").version})`;

    /**
     * API Url to be used on requests.
     * @type {string}
     */
    this.apiURL = `${Constants.REST.BASE_URL}/v${this.options.version}`;

    this.#deleteEmptyBuckets();
  }

  /**
   * Deletes all buckets that are labeled as inactive.
   * @returns {void}
   */
  #deleteEmptyBuckets () {
    for (const [route, bucket] of this.handlers.entries()) {
      if (bucket.inactive) this.handlers.delete(route);
    }

    setTimeout(() => this.#deleteEmptyBuckets(), 600000); // 10 Minutes
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

    if (!this.handlers.has(route)) this.handlers.add(route, new Bucket(this));

    const { requestOptions, formattedUrl } = this.#resolveRequest(url, method, options);

    return this.handlers.get(route).queueRequest(formattedUrl, requestOptions, route);
  }

  /**
   * Formats the request data to a usable format for axios
   * @param request The request data
   */
  #resolveRequest (url, method, options) {
    const headers = { "User-Agent": this.userAgent, "Content-Type": "application/json" };

    if (options.authenticate === undefined) options.authenticate = true;
    if (options.authenticate) headers.Authorization = `Bot ${this.client.token}`;

    if (options.data?.reason !== undefined) {
      headers["X-Audit-Log-Reason"] = options.data.reason;
      delete options.data.reason;
    }

    const formattedUrl = `${this.apiURL}/${url.replace(/[/]?(\w+)/, "$1")}`;

    const requestOptions = { data: options.data, method: method.toLowerCase(), headers };

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
