class Utils {
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
   * @params {Number} ms Timeout in MS
   * @returns {Promise<Boolean>}
   */
  static async delay (ms) {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), ms);
    });
  }
}

module.exports = Utils;
