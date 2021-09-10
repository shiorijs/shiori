const Collection = require("./Collection");

class LimitedCollection extends Collection {
  #options;

  /**
  * Constructs a limited collection with cache
  */
  constructor (cache = undefined, BaseClass = undefined) {
    super(BaseClass);

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
    * Adds a new item to this collection
    * @param {*} key The identifier to be used as the value key
    * @param {*} value The value to be added
    * @param {Array<*>} extra Extra parameters to be passed when instantiating the base class
    * @returns {?Collection} The created item, or null if none was created
    */
  add (id, item, ...extra) {
    if (this.limit === 0 || id == undefined) return item;

    if (this.has(id)) return this.get(id);
    if (this.#options && !this.#options.toAdd(item, id)) return;

    if (this.limit && this.size > this.limit) this.delete(this.keys().next().value);
    if (this.baseClass !== undefined) item = new this.baseClass(item, ...extra);

    return (this.set(id, item), item);
  }
}

module.exports = LimitedCollection;
