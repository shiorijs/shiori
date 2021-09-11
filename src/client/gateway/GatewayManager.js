const Collection = require("../../utils/Collection");

const Shard = require("./Shard");
const Constants = require("../../utils/Constants");

let Erlpack;

try {
  Erlpack = require("erlpack");
  /* eslint-disable no-empty */
} catch {}

const BASE_URL = "wss://gateway.discord.gg/";

/**
 * Websocket Manager
 */
class GatewayManager {
  constructor (client) {
    /**
     * The websocket URL to use
     * @private
     * @type {string}
     */
    this.websocketURL = `${BASE_URL}?v=${client.options.ws.version}&encoding=${Erlpack ? "etf" : "json"}`;

    /**
     * A collection that includes all of the gateway shards
     * @type {Collection<number, Shard>}
     */
    this.shards = new Collection();

    /**
     * Whether the first shard has been connected
     * @type {number}
     */
    this.firstShardConnected = false;

    /**
      * Shiori Client
      * @private
      * @type {Client}
      * @name GatewayManager#client
      */
    Object.defineProperty(this, "client", { value: client, writable: false });
  }

  async connect () {
    const shards = this.client.options.shardCount;

    for (let id = 0; id < shards; id++) {
      const shard = new Shard(this, id);

      if (this.firstShardConnected === true) await this.client.utils.delay(7500);

      this.firstShardConnected = true;
      this.shards.add(id, shard);

      shard.connect();
      shard.waitFor("ready", () => true).then(() => true);
    }
  }

  /**
    * Handle the received packet and trigger the corresponding event.
    * @param {object} packet The packet to handle
    * @param {Shard} shard The shard which the packet was received
    * @returns {boolean}
    */
  handlePacket (packet, shard) {
    if (!packet) return false;

    if (!this.client.options.blockedEvents.includes(packet.t)) {
      let event = null;

      try {
        event = require(`./handlers/${Constants.ClientEvents[packet.t]}`);
      } catch (error) {}

      if (event) event(this.client, packet, shard);
      else this.client.emit(packet.t, packet);
    }

    return true;
  }
}

module.exports = GatewayManager;
