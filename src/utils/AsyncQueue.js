/**
 * The AsyncQueue class used to sequentialize burst requests.
 * Based of https://github.com/sapphiredev/utilities/blob/main/packages/async-queue
 */
class AsyncQueue {
  /**
   * The promises array
   * @type {Array<Promise>}
   */
  #promises = [];

  /**
	 * The remaining amount of queued promises
   * @type {Number}
   * @readonly
	 */
  get remaining () {
    return this.#promises.length;
  }

  /**
	 * Waits for last promise and queues a new one
	 * @example
	 * const queue = new AsyncQueue();
	 * async function request(url, options) {
	 *   await queue.wait();
	 *   try {
	 *     const result = await fetch(url, options);
	 *     // Do some operations with 'result'
	 *   } finally {
	 *     // Remove first entry from the queue and resolve for the next entry
	 *     queue.shift();
	 *   }
	 * }
	 *
	 * request(someUrl1, someOptions1); // Will call fetch() immediately
	 * request(someUrl2, someOptions2); // Will call fetch() after the first finished
	 * request(someUrl3, someOptions3); // Will call fetch() after the second finished
	 */
  wait () {
    const next = this.#promises.length
      ? this.#promises[this.#promises.length - 1].promise
      : Promise.resolve();

    let resolve;

    const promise = new Promise(res => resolve = res);

    this.#promises.push({ resolve, promise });

    return next;
  }

  /**
	 * Frees the queue's lock for the next item to process
	 */
  shift () {
    const deferred = this.#promises.shift();
    if (deferred) deferred.resolve();
  }
}

module.exports = AsyncQueue;
