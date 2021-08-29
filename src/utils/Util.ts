export default class Util {
  /**
   * setTimeout but as a promise.
   * @param ms Timeout in MS
   */
  static delay = (ms: number): Promise<Boolean> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
