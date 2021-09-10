const Client = require("./client/Client");
const Constants = require("./utils/Constants");

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
Shiori.VoiceChannel = require("./structures/VoiceChannel");
Shiori.Role = require("./structures/Role");

// Interactions
Shiori.Interaction = require("./structures/Interactions/Interaction");
Shiori.ApplicationCommandInteraction = require("./structures/Interactions/ApplicationCommandInteraction");
Shiori.MessageComponentInteraction = require("./structures/Interactions/MessageComponentInteraction");

// Plugins
Shiori.ApplicationCommandPlugin = require("./plugins/ApplicationCommandPlugin");

// Utilities
Shiori.LimitedCollection = require("./utils/LimitedCollection");
Shiori.Collection = require("./utils/Collection");
Shiori.Intents = Constants.INTENTS;
Shiori.Constants = Constants;

module.exports = Shiori;
