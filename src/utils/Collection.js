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
  * @param {String} id The item id, to be used as the key
  * @param {Object} item The item to be added
  * @param {Array<Object>} extra Extra parameters to be used when creating the class
  * @returns {Class} The created item
  */
  add (id, item, ...extra) {
    if (!id) throw new Error("Missing id");
    if (this.has(id)) return this.get(id);

    if (!(item instanceof this.baseClass || item.constructor.name === this.baseClass.name))
      item = new this.baseClass(item, ...extra);

    return (this.set(id, item), item);
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

    // This will execute all of the parameters and return the last
    return (this.delete(item.id), this.get(item.id));
  }
}
