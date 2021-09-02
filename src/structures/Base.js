/**
 * Represents a discord structure.
 */
class Base {
  constructor (client) {
    /**
     * The client that instantiated this
     * @name Base#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, "client", { value: client });
  }

  _update (data) {
    return data;
  }

  /**
   * The date in which this object was created.
   * @type {?Date}
   * @readonly
   */
  get createdAt () {
    if (!this.id) return null;

    return new Date(Math.floor(this.id / 4194304) + 1420070400000);
  }
}

module.exports = Base;
