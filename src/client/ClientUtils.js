class ClientUtils {
  #client;

  /**
   * @param {Client} client The instantiating client
   */
  constructor (client) {
    this.#client = client;
  }

  /**
    * Gets a channel in the cache.
    * @param {string} channelId The id of the channel to get
    * @returns {?Channel} The channel.
    */
  getChannel (channelId) {
    const guildId = this.#client.channelMap[channelId];

    if (!guildId) return null;

    return this.#client.guilds.get(guildId).channels.get(channelId);
  }

  /**
   * setTimeout but as a promise.
   * @params {Number} ms Timeout in MS
   * @returns {Promise<Boolean>}
   */
  static async delay (ms) {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), ms);
    });
  }
}

module.exports = ClientUtils;
