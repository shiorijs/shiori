const Base = require("./Base");
const { ChannelTypes } = require("../utils/Constants");

/**
 * Represents any channel on Discord.
 * @extends {Base}
 */
class Channel extends Base {
  constructor (data, client) {
    super(client);

    /**
     * The channel's id
     * @type {string}
     */
    this.id = data.id;
  }

  static transform (data, client) {
    const TextChannel = require("./TextChannel");

    switch (data.type) {
      case ChannelTypes.GUILD_TEXT: return new TextChannel(data, client);
    }

    return new Channel(data, client);
  }
}

module.exports = Channel;
