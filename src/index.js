const Client = require("./client/Client");

function Shiori (token, options) {
  return new Client(token, options);
}

// Client
Shiori.Client = Client;
Shiori.ClientUtils = require("./client/ClientUtils");

// Structures
Shiori.Guild = require("./structures/Guild");
Shiori.Member = require("./structures/Member");
Shiori.User = require("./structures/User");
Shiori.Message = require("./structures/Message");
Shiori.Channel = require("./structures/Channel");
Shiori.GuildChannel = require("./structures/BaseGuildChannel");
Shiori.TextChannel = require("./structures/TextChannel");
Shiori.Interaction = require("./structures/Interaction");

// Utilities
Shiori.Collection = require("./utils/Collection");

module.exports = Shiori;
