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

  valueOf () {
    return this.id;
  }
}

module.exports = Base;
