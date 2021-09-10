class LimitedCollection extends Map {
  #options;

  /**
  * Constructs a temporarily collection
  */
  constructor (cache = undefined, BaseClass = undefined) {
    super();

    /**
     * The amount of items that this collection supports.
     * @type {number}
     */
    this.limit = cache?.limit ?? Infinity;

    /**
      * The cache options to be adressed to this collection
      * @private
      * @type {?CacheOptions}
      */
    this.#options = cache;

    this.baseClass = BaseClass;

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
    * @param {string} id The identifier to be used as the value key
    * @param {object} item The value to be added
    * @param {*[]} extra Extra parameters to be passed when instantiating the base class
    * @returns {object} The created item
    */
  add (id, item, ...extra) {
    if (this.limit === 0 || id == undefined) return item;

    if (this.has(id)) return this.get(id);
    if (this.#options && !this.#options.toAdd(item, id)) return;

    if (this.limit && this.size > this.limit) this.delete(this.keys().next().value);
    if (this.baseClass !== undefined) item = new this.baseClass(item, ...extra);

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
