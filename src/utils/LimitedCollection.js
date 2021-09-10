const Collection = require("./Collection");

/**
 * Represents a limited version of a Collection.
 * Will have all of it's items sweeped if the cache option is set.
 * @extends {Collection}
 */
class LimitedCollection extends Collection {
  #options;

  /**
   * @param {?CacheOptions} cache The cache options
   * @param {*} BaseClass The class that all items will be instantiaded when being created.
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
  add (key, value, ...extra) {
    if (this.limit === 0 || key == undefined) return value;

    if (this.has(key)) return this.get(key);
    if (this.#options && !this.#options.toAdd(value, key)) return;

    if (this.limit && this.size > this.limit) this.delete(this.keys().next().value);
    if (this.baseClass !== undefined) value = new this.baseClass(value, ...extra);

    return (this.set(key, value), value);
  }
}

module.exports = LimitedCollection;
