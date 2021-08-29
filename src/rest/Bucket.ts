import axios from "axios";
import AsyncQueue from "../utils/AsyncQueue";
import Util from "../utils/Util";
import RestManager from "./RestManager";

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
   */
  private asyncQueue = new AsyncQueue();
  /**
   * Remaining requests that can be made on this bucket.
   */
  remaining = 1;
  /**
   * Date in which the ratelimit resets.
   */
  reset: Date | number = 0;
  /**
   * Rest Manager.
   */
  manager: RestManager;
  /**
   * Whether we're global blocked or not.
   */
  globalBlocked: boolean;
  /**
   * If we're global blocked, when this global ratelimit resets.
   */
  globalReset: Date | number;

  constructor (manager: RestManager) {
    this.manager = manager;
  }

  /**
   * Whether this bucket is inactive (no pending requests).
   * @readonly
   */
  public get inactive (): boolean {
    return this.asyncQueue.remaining === 0 && !(this.globalLimited || this.localLimited);
  }

  /**
   * Whether we're global blocked or not.
   * @readonly
   */
  public get globalLimited (): boolean {
    return this.globalBlocked && Date.now() < Number(this.globalReset);
  }

  /**
   * Whether we're local limited or not.
   * @readonly
   */
  public get localLimited (): boolean {
    return this.remaining <= 0 && Date.now() < this.reset;
  }

  /**
   * Queue a request into the bucket.
   */
  public async queueRequest (url: string, options: RequestOptions, route: string): Promise<void> {
    // Wait for any previous requests to be completed before this one is run
    await this.asyncQueue.wait();
    try {
      return await this.executeRequest(url, options, route);
    } finally {
      // Allow the next request to fire
      this.asyncQueue.shift();
    }
  }

  /**
   * Executes a request and handle with ratelimits.
   * TODO: APIResult interface
   * @returns {APIResult}
   */
  async executeRequest (url: string, options: RequestOptions, route: string) {
    while (this.globalLimited || this.localLimited) {
      let timeout: Date | number;

      if (this.globalLimited) timeout = Number(this.globalReset) + Date.now();
      else timeout = this.reset - Date.now();

      if (this.globalLimited) {
        this.manager.client.emit("debug", `
        [Global Ratelimit]

        Route: ${route}
        Must wait ${timeout}ms before proceeding

        All requests will be blocked during this time.`);
      } else {
        this.manager.client.emit("debug", `
        [Local Ratelimit]

        Route: ${route}
        Must wait ${timeout}ms before proceeding`);
      }

      await Util.delay(timeout);
    }

    const result = await axios({ url, ...options });

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

    if (result.status === 204) {
      return result.data;
    } else if (result.status === 429) {
      if (this.reset) await Util.delay(this.reset);

      return this.executeRequest(url, options, route);
    }

    return result.data;
  }
}

interface RequestOptions {
 /* The data to be sent */
 data: object;
  /* Whether to authenticate the request */
 authenticate?: boolean;
}

export default Bucket;
