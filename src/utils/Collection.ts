import { CacheOptions } from "../../typings/index";

class Collection<K, V> extends Map<K, V> {
  limit: number;
  cache: CacheOptions | null;
  /**
  * Construct a Collection
  */
  constructor (cache = null) {
    super();

    /**
     * The amount of items that this collection supports.
     * @type {Number}
     */
    this.limit = cache?.limit ?? Infinity;

    /**
      * The cache of this collection.
      * @private
      * @type {Object | undefined}
      * @name Collection#cache
      */
    Object.defineProperty(this, "cache", { value: cache, writable: false });

    if (this.cache !== null) this.sweep();
  }

  private sweep (): void {
    const itemsToRemove = this.filter(this.cache.toRemove);

    if (itemsToRemove.length) {
      for (let i = 0; i < this.cache.sweep; i++) {
        if (!itemsToRemove[i]) break;
        else this.delete(itemsToRemove[i]);
      }
    }

    setTimeout(() => this.sweep(), this.cache.sweepTimeout);
  }

  // TODO: JSDOC
  public add (key: K, value: V): V {
    if (this.limit === 0) return value;

    if (key == undefined) throw new Error("Missing key");
    if (this.has(key)) return this.get(key);
    if (!this.cache?.toAdd(value, key)) return;

    if (this.limit && this.size > this.limit) this.delete([...this.keys()].slice(-1)[0]);

    return (this.set(key, value), value);
  }

  /**
    * Return all the objects that make the function evaluate true
    * @param {Function} fn A function that takes an object and returns true if it matches
    * @returns {Array<K>} An array containing all the objects that matched
    */
  public filter (fn: (value: V, key: K) => boolean): Array<K> {
    const results = [];

    for (const [key, value] of this) {
      if (fn(value, key)) results.push(key);
    }

    return results;
  }

  /**
  * Remove a key from this collection
  * @param {*} key The key to remove from this collection
  * @returns {boolean} True if the key has been removed, false otherwise
  */
  remove (key: K): boolean {
    if (!this.has(key)) return null;

    return this.delete(key);
  }
}

export default Collection;
