const Collection = require("../utils/Collection");
const LimitedCollection = require("../utils/LimitedCollection");

/**
 * Represents a cache manager.
 */
class Cache {
  /**
   * @param {CacheOptions} cacheOptions The cache options, if set, this cache will hold a Limited Collection
   */
  constructor (cacheOptions, BaseClass) {
    /**
     * The collection of this cache, if cache options is set the collection will be Limited.
     * @type {LimitedCollection | Collection}
     */
    this.cache = cacheOptions !== undefined
      ? new LimitedCollection(cacheOptions, BaseClass)
      : new Collection(BaseClass);

    /**
     * Whether this collection is limited or not
     * @type {boolean}
     */
    this.limited = this.cache instanceof LimitedCollection;
  }

  /**
    * Returns a specific element from the cache.
    * @returns {?*} The item that was found, or null if none was found
    */
  get (id) {
    return this.cache.get(id) ?? null;
  }

  /**
    * Adds a new item to the cache
    * @param {*} key The identifier to be used as the value key
    * @param {*} value The value to be added
    * @param {Array<*>} extra Extra parameters to be passed when instantiating the base class
    * @returns {?Collection} The created item, or null if none was created
    */
  add (id, item, extra = []) {
    return this.cache.add(id, item, extra);
  }

  /**
    * Returns all elements that pass the test implemented by the provided function.
    * @param {Function} callback A function to test each element of the cache, must return a boolean.
    * @returns {Array<*>} An array containing all the keys that matched
    */
  filter (callback) {
    return this.cache.filter(callback);
  }

  /**
    * Searches for the first item in the cache that satisfies the provided testing function.
    * @param {Function} callback The function to execute on each item of the cache, must return a boolean.
    * @returns {?*} The item that was found, or null if none was found
    */
  find (callback) {
    return this.cache.find(callback);
  }

  /**
    * Returns an array populated with the results of calling a provided function on every element of the cache.
    * @param {Function} callback The function that will be called for every element of the cache.
    * @returns {Array} An array with each element being the result of the callback function.
    */
  map (callback) {
    return this.cache.map(callback);
  }

  /**
    * Removes an item from the cache and returns that item
    * @param {*} key The idenfifier of the value to be removed
    * @returns {Collection?} The removed object, or null if nothing was removed
    */
  remove (id) {
    return this.cache.remove(id);
  }
}

module.exports = Cache;
