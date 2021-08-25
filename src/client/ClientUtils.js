module.exports = class ClientUtils {
  #client;

  constructor (client) {
    this.#client = client;
  }

  getChannel (channelId) {
    const guildId = this.#client.channelMap[channelId];

    if (!guildId) return null;

    return this.#client.guilds.get(guildId).channels.get(channelId);
  }
};
