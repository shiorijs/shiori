const Collection = require("../utils/Collection");
const LimitedCollection = require("../utils/LimitedCollection");

class Cache {
  constructor (cacheValues, BaseClass) {
    this.cache = cacheValues !== undefined
      ? new LimitedCollection(cacheValues, BaseClass)
      : new Collection(BaseClass);

    this.limited = this.cache instanceof LimitedCollection;
  }

  get (id) {
    return this.cache.get(id);
  }

  /**
    * Adds a new item to this collection
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
    * @param {Function} callback A function to test each element of this collection, must return a boolean.
    * @returns {Array<*>} An array containing all the keys that matched
    */
  filter (callback) {
    return this.cache.filter(callback);
  }

  /**
    * Searches for the first item in this collection that satisfies the provided testing function.
    * @param {Function} callback The function to execute on each item of this collection, must return a boolean.
    * @returns {?*} The item that was found, or null if none was found
    */
  find (callback) {
    return this.cache.find(callback);
  }

  /**
    * Returns an array populated with the results of calling a provided function on every element of this collection.
    * @param {Function} callback The function that will be called for every element of this collection.
    * @returns {Array} An array with each element being the result of the callback function.
    */
  map (callback) {
    return this.cache.map(callback);
  }

  /**
    * Removes an item from this collection and returns that item
    * @param {*} key The idenfifier of the value to be removed
    * @returns {Collection?} The removed object, or null if nothing was removed
    */
  remove (id) {
    return this.cache.remove(id);
  }
}

module.exports = Cache;
