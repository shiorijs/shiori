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

<<<<<<< HEAD
=======

>>>>>>> cfa33d23090bb01c36e8d96f301ad3f7f615aa0e
  _update (data) {
    return data;
  }

  valueOf () {
    return this.id;
  }
}

module.exports = Base;
