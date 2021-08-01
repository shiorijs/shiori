const Shard = require("./Shard");
const PacketHandlers = require("./handlers/")

const BASE_URL = "wss://gateway.discord.gg/"

module.exports = class GatewayManager {
  constructor (client) {
    /**
     * The websocket URL to use
     * @private
     * @type {string}
    */
    this.websocketURL = `${BASE_URL}?v=${client.options.websocket.version}&encoding=etf`;

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
  */
  async createShardConnection() {
    const { shards } = this.client.options;

    this.queue = new Set(shards.map(id => new Shard(this, id)));

    return this.connectShard();
  }

  /**
  * Connects the last shard of the queue.
  * @private
  */
  async connectShard() {
    const [shard] = this.queue;

    this.queue.delete(shard);

    await shard.connect()
      .catch((error) => {
        if (!error || !error.code) this.queue.add(shard);
        else throw error;
      })

    if (this.queue.size) setTimeout(() => this.connectShard(), 3000)
  }

  handlePacket(packet, shard) {
    if (!packet) return false;

    if (!this.client.options.blockedEvents.includes(packet.t)) {
      const event = PacketHandlers[packet.t];

      if (event) event(this.client, packet, shard);
    }

    return true;
  }
}
