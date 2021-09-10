const LimitedCollection = require("../utils/LimitedCollection");

module.exports = class CachedManager {
  constructor (name, cacheValues) {
    this.name = name;
    this.cache = new LimitedCollection(cacheValues);
  }

  get (id) {
    return this.cache.get(id);
  }

  /**
    * Adds an item on the collection
    * @param {string} id The item id, to be used as the key
    * @param {object} item The item to be added
    * @returns {object} The created item
    */
  add (id, item) {
    return this.cache.add(id, item);
  }

  /**
    * Return all the objects that make the function evaluate true
    * @param {Function} func A function that takes an object and returns true if it matches
    * @returns {Class[]} An array containing all the objects that matched
    */
  filter (func) {
    const array = [];

    for (const [id, item] of this.cache.entries()) {
      if (func(item, id)) array.push(id);
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

    for (const item of this.cache.values()) array.push(func(item));

    return array;
  }

  /**
  * Remove an object
  * @param {object} item The object
  * @param {string} [item.id] The ID of the object
  * @returns {Class?} The removed object, or null if nothing was removed
  */
  remove (item) {
    if (!this.cache.has(item.id)) return null;

    return (this.cache.delete(item.id), this.cache.get(item.id));
  }
};
