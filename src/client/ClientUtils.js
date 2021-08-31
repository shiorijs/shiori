class ClientUtils {
  #client;

  /**
   * @param {Client} client The instantiating client
   */
  constructor (client) {
    this.#client = client;
  }

  getChannel (channelId) {
    const guildId = this.#client.channelMap[channelId];

    if (!guildId) return null;

    return this.#client.guilds.get(guildId).channels.get(channelId);
  }

  /**
   * setTimeout but as a promise.
   * @param {number} ms Timeout in MS
   * @returns {Promise<boolean>}
   */
   static delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = ClientUtils;
