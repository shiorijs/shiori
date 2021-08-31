const Base = require("./Base");
const Channel = require("./Channel");
const Collection = require("../utils/Collection");

/**
  * Represents a discord guild
  * @extends {Base}
  */
class Guild extends Base {
  /**
   * @param {object} data The guild structure data
   * @param {Client} client Shiori Client
   */
  constructor (data, client) {
    super(client);

    const cache = client.options.cache;

    /**
     * Members that belongs to this guild
     * @type {Collection<String, Member>}
     * @name Guild#members
     */
    Object.defineProperty(this, "members", { value: new Collection(cache.members), writable: true });

    /**
     * Channels that belongs to this guild
     * @type {Collection<String, Channel>}
     * @name Guild#channels
     */
    Object.defineProperty(this, "channels", { value: new Collection(cache.channels), writable: true });

    this._update(data);
  }

  _update (data) {
    /**
     * Guild ID
     * @type {string}
     */
    this.id = data.id;

    if ("channels" in data) {
      for (const _channel of data.channels) {
        _channel.guildId = this.id;
        const channel = Channel.transform(_channel, this.client);

        if (!channel.id) continue;

        this.channels.add(channel.id, channel);
        this.client.channelMap[channel.id] = this.id;
      }
    }

    if ("name" in data) {
      /**
       * Guild Name
       * @type {string}
       */
      this.name = data.name;
    }
  }
}

module.exports = Guild;
