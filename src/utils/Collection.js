class Collection extends Map {
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
      * The cache of this collection.
      * @private
      * @type {object | undefined}
      * @name Collection#cache
      */
    Object.defineProperty(this, "cache", { value: cache, writable: false });

    if (this.cache !== undefined) this.#sweep();
  }

  /**
   * Deletes all items marked as deletable by the user.
   * @returns {void}
   */
  #sweep () {
    const itemsToRemove = this.filter(this.cache.toRemove);

    if (itemsToRemove.length) {
      for (let i = 0; i < this.cache.sweep; i++) {
        if (!itemsToRemove[i]) break;
        else this.delete(itemsToRemove[i]);
      }
    }

    setTimeout(() => this.#sweep(), this.cache.sweepTimeout);
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
    if (!this.cache?.toAdd(id, item)) return;

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
      if (func(id, item)) array.push(id);
    }

    return array;
  }

  /**
    * Return an array with the results of applying the given function to each element
    * @param {Function} func A function that takes an object and returns something
    * @returns {Array} An array containing the results
    */
  map (func) {
    const array = [];

    for (const item of this.values()) array.push(func(item));

    return array;
  }

  /**
  * Remove an object
  * @param {object} item The object
  * @param {string} [item.id] The ID of the object
  * @returns {Class?} The removed object, or null if nothing was removed
  */
  remove (item) {
    if (!this.has(item.id)) return null;

    return (this.delete(item.id), this.get(item.id));
  }
}

module.exports = Collection;
