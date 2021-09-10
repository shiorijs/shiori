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
    * Adds an item on the collection
    * @param {string} id The item id, to be used as the key
    * @param {object} item The item to be added
    * @param {*[]} extra Extra parameters to be passed when instantiating the base class
    * @returns {object} The created item
    */
  add (id, item, extra = []) {
    return this.cache.add(id, item, extra);
  }

  /**
    * Return all the objects that make the function evaluate true
    * @param {Function} func A function that takes an object and returns true if it matches
    * @returns {Class[]} An array containing all the objects that matched
    */
  filter (func) {
    return this.cache.filter(func);
  }

  /**
    * Return an array with the results of applying the given function to each element
    * @param {Function} func A function that takes an object and returns something
    * @returns {Array} An array containing the results
    */
  map (func) {
    return this.cache.map(func);
  }

  /**
  * Remove an object
  * @param {string} id The identifier of the value to be removed
  * @returns {Class?} The removed object, or null if nothing was removed
  */
  remove (id) {
    return this.cache.remove(id);
  }
}

module.exports = Cache;
