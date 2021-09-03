const Channel = require("./Channel");

/**
 * Represents a guild voice channel.
 * @extends {Base}
 */
class VoiceChannel extends Channel {
  /**
   * @param {object} data The voice channel structure data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(client);

    this._update(data);
  }

  _update (data) {
    return data;
  }
}

module.exports = VoiceChannel;
