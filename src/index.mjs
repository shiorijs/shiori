import * as Shiori from "./index";

export default function (token, options) {
  return new Shiori.Client(token, options);
}

export const {
  // Client
  Client,
  ClientUtils,

  // Structures
  Guild,
  Member,
  User,
  Message,
  Channel,
  GuildChannel,
  TextChannel,
  Interaction,

  // Utilities
  Collection
} = Shiori;
