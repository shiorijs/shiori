const Shard = require("./Shard");
const PacketHandlers = require("./handlers/");

let Erlpack;

try {
  Erlpack = require("erlpack");
  /* eslint-disable no-empty */
} catch {}

const BASE_URL = "wss://gateway.discord.gg/";

/**
 * Websocket Manager
 */
module.exports = class GatewayManager {
  constructor (client) {
    /**
     * The websocket URL to use
     * @private
     * @type {string}
     */
    this.websocketURL = `${BASE_URL}?v=${client.options.ws.version}&encoding=${Erlpack ? "etf" : "json"}`;

    /**
      * Hitomi Client
      * @private
      * @type {Client}
      * @name GatewayManager#client
      */
    Object.defineProperty(this, "client", { value: client, writable: false });
    /**
      * Shards queue
      * @private
      * @type {Set<Shard>}
      * @name GatewayManager#queue
      */
    Object.defineProperty(this, "queue", { value: null, writable: true });
  }

  /**
    * Connect all shards and create a websocket connection for each one.
    * @returns {Function}
    */
  createShardConnection () {
    const { shards } = this.client.options;

    this.queue = new Set(shards.map(id => new Shard(this, id)));

    return this.#connectShard();
  }

  /**
  * Connects the last shard of the queue.
  * @param {Shard | null} - The shard to be connected, if none, will connect the first shard of the queue
  * @private
  * @returns {void}
  */
  async #connectShard (_shard = null) {
    const [shard] = _shard || this.queue;

    if (!shard || shard.id == undefined) return;

    this.queue.delete(shard);
    this.client.shards.add(shard.id, shard);

    try {
      await shard.connect();
    } catch (error) {
      if (!error || !error.code) this.queue.add(shard);
      else throw error;
    }

    if (this.queue.size) setTimeout(() => this.#connectShard(), 5000);
  }

  /**
    * Handle the received packet and trigger the corresponding event.
    * @param {Object} packet The packet to handle
    * @param {Shard} shard The shard which the packet was received
    * @returns {Boolean}
    */
  handlePacket (packet, shard) {
    if (!packet) return false;

    if (!this.client.options.blockedEvents.includes(packet.t)) {
      const event = PacketHandlers[packet.t];

      if (event) event(this.client, packet, shard);
      else this.client.emit(packet.t, packet);
    }

    return true;
  }
};
