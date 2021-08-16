module.exports = class Bucket {
  constructor () {
    this.remaining = 1;
    this.limit = 1;
    this.resetAfter = 0;
    this.routeQueue = [];
  }

  checkRateLimit () {
    return new Promise((resolve) => {
      const now = Date.now();
      if (!this.resetAfter || this.resetAfter < now) {
        this.resetAfter = now;
        this.remaining = 1;
      }

      if (this.remaining <= 0) return setTimeout(
        () => this.checkRateLimit(), Math.max(0, this.resetAfter - now) + 1
      );

      this.remaining -= 1;

      this.routeQueue.shift()().then((data) => {
        if (this.routeQueue.length) this.checkRateLimit();

        return resolve(data);
      });
    });
  }

  /**
  * Queue a function in the bucket
  * @param {Function} callback - the callack to execute
  */
  queue (callback) {
    this.routeQueue.push(callback);

    return this.checkRateLimit();
  }
};
