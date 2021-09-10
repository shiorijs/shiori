/**
 * Represents a refactored version of Map.
 * @extends {Map}
 */
class Collection extends Map {
  /**
   * @param {*} BaseClass The class that all items will be instantiaded when being created.
   */
  constructor (BaseClass = undefined) {
    super();

    /**
     * The class that all items will be instantiaded when being created.
     * @type {*}
     */
    this.baseClass = BaseClass;
  }

  /**
    * Adds a new item to this collection
    * @param {*} key The identifier to be used as the value key
    * @param {*} value The value to be added
    * @param {Array<*>} extra Extra parameters to be passed when instantiating the base class
    * @returns {?Collection} The created item, or null if none was created
    */
  add (key, value, ...extra) {
    if (key == undefined || value == undefined) return null;

    if (this.has(key)) return this.get(key);
    if (this.baseClass !== undefined && !(value instanceof this.baseClass))
      value = new this.baseClass(value, ...extra);
      
    return (this.set(key, value), value);
  }

  /**
    * Returns all elements that pass the test implemented by the provided function.
    * @param {Function} callback A function to test each element of this collection, must return a boolean.
    * @returns {Array<*>} An array containing all the keys that matched
    */
  filter (callback) {
    const array = [];

    for (const [key, value] of this.entries()) {
      if (callback(value, key)) array.push(key);
    }

    return array;
  }

  /**
    * Searches for the first item in this collection that satisfies the provided testing function.
    * @param {Function} callback The function to execute on each item of this collection, must return a boolean.
    * @returns {?*} The item that was found, or null if none was found
    */
  find (callback) {
    for (const [key, value] of this.entries()) {
      if (callback(value, key)) return value;
    }

    return null;
  }

  /**
    * Returns an array populated with the results of calling a provided function on every element of this collection.
    * @param {Function} callback The function that will be called for every element of this collection.
    * @returns {Array} An array with each element being the result of the callback function.
    */
  map (callback) {
    const array = [];

    for (const [key, value] of this.entries()) array.push(callback(value, key));

    return array;
  }

  /**
    * Removes an item from this collection and returns that item
    * @param {*} key The idenfifier of the value to be removed
    * @returns {Collection?} The removed object, or null if nothing was removed
    */
  remove (key) {
    if (!this.has(key)) return null;

    const value = this.get(key);

    return (this.delete(key), value);
  }
}

module.exports = Collection;
