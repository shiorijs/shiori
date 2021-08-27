class Collection extends Map {
  /**
  * Construct a Collection
  */
  constructor (cache = {}) {
    super();

    /**
     * The limit of items that this collection supports.
     * @type {Number}
     */
    this.limit = cache.limit ?? 100;

    /**
     * The cache of this collection.
     * @type {Object}
     */
    this.cache = cache;

    if (Object.keys(this.cache).length > 0) this.#sweep();
  }

  /**
   * Deletes all items marked as deletable by the user.
   * @returns {void}
   */
  #sweep () {
    const itemsToRemove = [
      ...this.filter(this.cache.toRemove)
    ].slice(0, -Number(this.cache.sweep));

    for (let i = 0; i < itemsToRemove.length; i++) {
      this.delete(itemsToRemove[i]);
    }

    setTimeout(() => this.#sweep(), this.cache.sweepTimeout);
  }

  /**
    * Adds a item on the collection
    * @param {String} id The item id, to be used as the key
    * @param {Object} item The item to be added
    * @returns {Object} The created item
    */
  add (id, item) {
    if (this.limit === 0) return item;

    if (id == undefined) throw new Error("Missing id");
    if (this.has(id)) return this.get(id);
    if (!this.cache?.toAdd(id, item)) return;

    if (this.limit && this.size > this.limit) this.delete([...this.keys()].slice(-1));

    return (this.set(id, item), item);
  }

  /**
    * Return all the objects that make the function evaluate true
    * @param {Function} func A function that takes an object and returns true if it matches
    * @returns {Array<Class>} An array containing all the objects that matched
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
  * @param {Object} item The object
  * @param {String} [item.id] The ID of the object
  * @returns {Class?} The removed object, or null if nothing was removed
  */
  remove (item) {
    if (!this.has(item.id)) return null;

    // This will execute all of the parameters and return the last
    return (this.delete(item.id), this.get(item.id));
  }
}

module.exports = Collection;
