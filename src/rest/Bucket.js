const AsyncQueue = require("../utils/AsyncQueue");
const axios = require("axios");

function getAPIOffset(serverDate) {
  return new Date(serverDate).getTime() - Date.now();
}

function calculateReset(reset, serverDate) {
  return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate);
}

const delay = async (ms) =>
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), ms)
  })

module.exports = class Bucket {
  #asyncQueue = new AsyncQueue();
  remaining = 1;
  reset = 0;

  constructor (manager) {
    this.manager = manager;
  }

  get globalLimited() {
    return this.globalBlocked && Date.now() < Number(this.globalReset);
  }

  get localLimited() {
    return this.remaining <= 0 && Date.now() < this.reset;
  }

  async queueRequest (url, options, route) {
    // Wait for any previous requests to be completed before this one is run
    await this.#asyncQueue.wait();
    try {
      return await this.executeRequest(url, options, route);
    } finally {
      // Allow the next request to fire
      this.#asyncQueue.shift();
    }
  }

  async executeRequest (url, options, route) {
    while (this.globalLimited || this.localLimited) {
      let delayPromise, timeout;

      if (this.globalLimited) {
        timeout = Number(this.globalReset) + Date.now();

        delayPromise = delay(timeout);
      } else {
        timeout = this.reset - Date.now();

        delayPromise = delay(timeout);
      }

      if (this.globalLimited) {
        this.manager.client.emit(
          "warn", `We are globally rate limited, blocking all requests for ${timeout}ms`
        );
      } else {
        this.manager.client.emit("warn", `Waiting ${timeout}ms for rate limit to pass`);
      }

      await delayPromise;
    }

    const result = await axios({ url, ...options });

    const serverDate = result.headers['date'];
    const remaining = result.headers['x-ratelimit-remaining'];
    const limit = result.headers['x-ratelimit-limit'];
    const reset = result.headers['x-ratelimit-reset'];

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

    if (result.status === 204) {
      return result.data;
    } else if (result.status === 429) {
      if (this.reset) await delay(this.reset);

      return this.executeRequest(url, options);
    }

    return result.data;
  }
};
