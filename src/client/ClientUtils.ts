import { Snowflake } from "../../typings/index";
import Client from "./Client";

class ClientUtils {
  #client: Client;

  constructor (client: Client) {
    this.#client = client;
  }

  public getChannel (channelId: Snowflake) {
    const guildId = this.#client.channelMap[channelId];

    if (!guildId) return null;

    return this.#client.guilds.get(guildId).channels.get(channelId);
  }

  static async delay (ms: number) {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), ms);
    });
  }
}

export default ClientUtils;;
