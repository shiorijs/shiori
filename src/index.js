module.exports = {
  // Client
  Client: require("./client/Client"),

  // Structures
  Guild: require("./structures/Guild"),
  Member: require("./structures/Member"),
  User: require("./structures/User"),
  Message: require("./structures/Message"),
  Channel: require("./structures/Channel"),
  GuildChannel: require("./structures/BaseGuildChannel"),
  TextChannel: require("./structures/TextChannel"),
  VoiceChannel: require("./structures/VoiceChannel"),
  Role: require("./structures/Role"),
  Interaction: require("./structures/Interaction"),

  // Utilities
  Collection: require("./utils/Collection"),
  AsyncQueue: require("./utils/AsyncQueue"),
  Constants: require("./utils/Constants")
};
