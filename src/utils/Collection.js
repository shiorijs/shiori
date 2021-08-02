module.exports = class Collection extends Map {
  /**
  * Construct a Collection
  * @param {Class} baseClass The class that all items should extend
  */
  constructor(baseClass) {
    super();

    this.baseClass = baseClass;
  }

  /**
  * Adds a item on the collection
  * @param {Object} item The item to be added
  * @param {String} item.id The item id, to be used as the key
  * @param {Boolean} [replace] Whether to replace an existing item with the same ID
  * @returns {Class} The created item
  */
  add (item, replace = false) {
    if (!item.id) throw new Error("Missing item#id");
    if (this.has(item.id) && !replace) return this.get(item.id);

    if (!item instanceof this.baseClass) item = new this.baseClass(item);

    this.set(item.id, item);

    return item;
  }

  /**
  * Return all the objects that make the function evaluate true
  * @param {Function} func A function that takes an object and returns true if it matches
  * @returns {Array<Class>} An array containing all the objects that matched
  */
  filter(func) {
    const array = [];

    for (const item of this.values) {
      if (func(item)) array.push(item);
    }

    return array
  }

  /**
  * Return an array with the results of applying the given function to each element
  * @param {Function} func A function that takes an object and returns something
  * @returns {Array} An array containing the results
  */
  map(func) {
    const array = [];

    for (const item of this.values()) array.push(func(item));

    return array;
  }

  /**
  * Remove an object
  * @param {Object} item The object
  * @param {String} item.id The ID of the object
  * @returns {Class?} The removed object, or null if nothing was removed
  */
  remove(item) {
    if (!this.has(object.id)) return null;

    // Means: execute the first parameter and return the last
    return (this.delete(item.id), this.get(item.id));
  }
}
