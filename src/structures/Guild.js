const Base = require("./Base");
const Channel = require("./Channel");
const Collection = require("../utils/Collection");

/**
  * Represents a discord guild
  * @extends {Base}
  */
class Guild extends Base {
  /**
   * @param {Client} client Hitomi Client
   * @param {Object} data The guild structure data
   */
  constructor (data, client) {
    super(client);

    /**
     * Members that belongs to this guild
     * @type {Collection<String, Member>}
     * @name Guild#members
     */
    Object.defineProperty(this, "members", { value: new Collection(), writable: true });

    /**
     * Channels that belongs to this guild
     * @type {Collection<String, Channel>}
     * @name Guild#channels
     */
    Object.defineProperty(this, "channels", { value: new Collection(), writable: true });

    this._update(data);
  }

  _update (data) {
    /**
     * Guild ID
     * @type {String}
     */
    this.id = data.id;

    if (data.channels) {
      for (const _channel of data.channels) {
        _channel.guild = this;
        const channel = Channel.transform(_channel, this.client);

        if (!channel.id) {
          //console.log(_channel);
          continue
        };

        this.channels.add(channel.id, channel);
        this.client.channelMap[channel.id] = this.id;
      }
    }

    if (data.name) {
      /**
       * Guild Name
       * @type {String}
       */
      this.name = data.name;
    }
  }
};

module.exports = Guild;
