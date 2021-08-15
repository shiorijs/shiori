module.exports = class Bucket {
  constructor () {
    this.remaining = 1;
    this.resetAfter = 0;
    this.routeQueue = [];
  }

  checkRateLimit() {
    const now = Date.now();

    if (!this.resetAfter || this.resetAfter < now) this.resetAfter = now;

    if (this.remaining <= 0 && this.resetAfter > 0)
      return setTimeout(() => this.checkRateLimit(), this.resetAfter);

    this.remaining -= 1;

    this.routeQueue.shift()().then(() => {
      if (this.routeQueue.length) return this.checkRateLimit();
    });
  }

  /**
  * Queue a function in the bucket
  * @param {Function} callback - the callack to execute
  */
  queue(callback) {
    this.routeQueue.push(callback);

    return this.checkRateLimit()
  }
}
