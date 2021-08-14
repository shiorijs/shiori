const Collection = require("../utils/Collection");

module.exports = class Message {
  constructor (data, client) {
    this.id = data.id;
    this.type = data.type || 0;
    this.timestamp = Date.parse(data.timestamp);
    this.channel = data.channel_id;
    this.content = "";
    this.reactions = {};
    this.guildID = data.guild_id;
    this.webhookID = data.webhook_id;

    Object.definedProperty(this, "client", { value: client });
  }
}
