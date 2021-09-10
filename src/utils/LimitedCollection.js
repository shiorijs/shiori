class LimitedCollection extends Map {
  #options;

  /**
  * Construct a Collection
  */
  constructor (cache = undefined) {
    super();

    /**
     * The amount of items that this collection supports.
     * @type {number}
     */
    this.limit = cache?.limit ?? Infinity;

    /**
      * The cache options to be adressed to this collection
      * @private
      * @type {object | undefined}
      */
    this.#options = cache;

    if (this.#options !== undefined) this.#sweep();
  }

  /**
   * Deletes all items marked as deletable by the user.
   * @returns {void}
   */
  #sweep () {
    const itemsToRemove = this.filter(this.#options.toRemove);

    if (itemsToRemove.length) {
      for (let i = 0; i < this.#options.sweep; i++) {
        if (!itemsToRemove[i]) break;
        else this.delete(itemsToRemove[i]);
      }
    }

    setTimeout(() => this.#sweep(), this.#options.sweepTimeout);
  }

  /**
    * Adds a item on the collection
    * @param {string} id The item id, to be used as the key
    * @param {object} item The item to be added
    * @returns {object} The created item
    */
  add (id, item) {
    if (this.limit === 0) return item;

    if (id == undefined) throw new Error("Missing id");
    if (this.has(id)) return this.get(id);
    if (this.#options && !this.#options.toAdd(item, id)) return;

    if (this.limit && this.size > this.limit) this.delete([...this.keys()].slice(-1)[0]);

    return (this.set(id, item), item);
  }

    /**
    * Return all the objects that make the function evaluate true
    * @param {Function} func A function that takes an object and returns true if it matches
    * @returns {Class[]} An array containing all the objects that matched
    */
     filter (func) {
      const array = [];
  
      for (const [id, item] of this.entries()) {
        if (func(item, id)) array.push(id);
      }
  
      return array;
    }
}

module.exports = LimitedCollection;
