const Shard = require("./Shard");

const BASE_URL = "wss://gateway.discord.gg/"

module.exports = class GatewayManager {
  constructor (client) {
    this.client = client;

    this.url = `${BASE_URL}?v=${client.options.gatewayVersion}&encoding=etf`;

    Object.defineProperty(this, 'queue', { value: new Set(), writable: true });
  }

  async createShardConnection() {
    const { shards } = this.client.options;

    this.queue = new Set(shards.map(id => new Shard(this, id)));

    return this.connectShard();
  }

  async connectShard() {
    const [shard] = this.queue;

    this.queue.delete(shard);

    await shard.connect()
      .catch((error) => console.error(error))

    if (this.queue.size) {
      setTimeout(() => this.createShardConnection(), 3000)
    }
  }

  async websocketMessageReceive(data) {
    data = Erlpack.unpack(data);

    console.log(data);
  }
}
