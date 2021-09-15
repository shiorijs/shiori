const AsyncQueue = require("../utils/AsyncQueue");

function getAPIOffset (serverDate) {
  return new Date(serverDate).getTime() - Date.now();
}

function calculateReset (reset, serverDate) {
  return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate);
}

/**
  * Handle request ratelimits.
  */
class Bucket {
  /**
   * Queue used to store requests.
   * @type {AsyncQueue}
   */
  #asyncQueue = new AsyncQueue();
  /**
   * Remaining requests that can be made on this bucket.
   * @type {number}
   */
  remaining = 1;
  /**
   * Date in which the ratelimit resets.
   * @type {Date}
   */
  reset = 0;

  constructor (manager) {
    /**
     * Rest Manager.
     * @type {RestManager}
     */
    this.manager = manager;
  }

  /**
   * Whether this bucket is inactive (no pending requests).
   * @type {boolean}
   * @readonly
   */
  get inactive () {
    return this.#asyncQueue.remaining === 0 && !(this.globalLimited || this.localLimited);
  }

  /**
   * Whether we're global blocked or not.
   * @type {boolean}
   * @readonly
   */
  get globalLimited () {
    return this.globalBlocked && Date.now() < Number(this.globalReset);
  }

  /**
   * Whether we're local limited or not.
   * @type {boolean}
   * @readonly
   */
  get localLimited () {
    return this.remaining <= 0 && Date.now() < this.reset;
  }

  /**
   * Queue a request into the bucket.
   * @param {string} path URL to make the request to
   * @param {object} [options] The options to use on the request
   * @param {object} [options.data] The data to be sent
   * @param {boolean} [options.authenticate] Whether to authenticate the request
   * @param {string} route The cleaned route
   */
  async queueRequest (path, options, route) {
    // Wait for any previous requests to be completed before this one is run
    await this.#asyncQueue.wait();
    try {
      return await this.executeRequest(path, options, route);
    } finally {
      // Allow the next request to fire
      this.#asyncQueue.shift();
    }
  }

  /**
   * Executes a request and handle with ratelimits.
   * TODO: APIResult interface
   * @returns {APIResult}
   */
  async executeRequest (path, options, route) {
    while (this.globalLimited || this.localLimited) {
      let timeout;

      if (this.globalLimited) timeout = Number(this.globalReset) + Date.now();
      else timeout = this.reset - Date.now();

      if (this.globalLimited) {
        this.manager.client.debug([
          `Route: ${route}`,
          `Must wait ${timeout}ms before proceeding`,
          "",
          "All requests will be blocked during this time"
        ], "Global Ratelimit")
      } else {
        this.manager.client.debug([
          `Route: ${route}`,
          `Must wait ${timeout}ms before proceeding`
        ], "Local Ratelimit")
      }

      await this.manager.client.utils.delay(timeout);
    }

    const result = await this.manager.client.utils.request({ path, ...options })
      .catch(error => error);

    const serverDate = result.headers.date;
    const remaining = result.headers["x-ratelimit-remaining"];
    const reset = result.headers["x-ratelimit-reset"];

    this.remaining = remaining !== null ? Number(remaining) : 1;
    this.reset = reset !== null
      ? calculateReset(reset, serverDate)
      : Date.now();

    if (route.includes("reactions")) {
      this.reset = new Date(serverDate).getTime() - getAPIOffset(serverDate) + 250;
    }

    const retryAfter = Number(result.headers["retry-after"]) * 1000 ?? -1;

    if (retryAfter > 0) {
      if (result.headers["x-ratelimit-global"]) {
        this.globalBlocked = true;
        this.globalReset = Date.now() + retryAfter;
      } else {
        this.reset = retryAfter;
      }
    }

    if (result.status === 429) {
      this.manager.client.debug([
        `A ratelimit happened on the route ${route}`,
        "This happened because this request was not previously stored on the bucket. Probably caused by the bot restarting."
      ], "Unexpected Ratelimit")
      
      if (this.reset) await this.manager.client.utils.delay(this.reset);

      return this.executeRequest(path, options, route);
    }

    return result.data;
  }
}

module.exports = Bucket;
