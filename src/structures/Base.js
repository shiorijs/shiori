/**
 * Represents a discord structure.
 */
module.exports = class Base {
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
};
