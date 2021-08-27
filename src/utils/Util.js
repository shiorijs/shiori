module.exports = class Util {
  /**
   * setTimeout but as a promise.
   * @param {Number} ms Timeout in MS
   * @returns {Promise<Boolean>}
   */
  static delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
};
