const delay = async (ms) =>
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), ms)
  })

module.exports = class Bucket {
  #tasks = [];
  remaining = 1;
  reset = 0;

  get globalLimited() {
    return this.globalBlocked && Date.now() < Number(this.globalReset);
  }

  get localLimited() {
    return this.remaining <= 0 && Date.now() < this.reset;
  }

  checkRateLimit () {
    return new Promise(async (resolve) => {
      while (this.globalLimited || this.localLimited) {
        let delayPromise

        if (this.globalLimited) {
          const timeout = Number(this.globalReset) + Date.now();

          delayPromise = delay(timeout);
        } else {
          delayPromise = delay(this.reset - Date.now());
        }

        await delayPromise;
      }

      if (!this.globalReset || this.globalReset < Date.now()) this.globalReset = Date.now() + 1000;

      this.#tasks.shift()().then((data) => {
        if (this.#tasks.length) this.checkRateLimit();

        return resolve(data);
      });
    });
  }

  /**
  * Queue a function in the bucket
  * @param {Function} callback - the callack to execute
  */
  queue (callback) {
    this.#tasks.push(callback);

    return this.checkRateLimit();
  }
};
