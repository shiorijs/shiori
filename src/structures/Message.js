const User = require("./User");

module.exports = class Message {
  constructor (data, client) {
    Object.defineProperty(this, "client", { value: client });

    this.id = data.id;
    this.type = data.type;
    this.content = data.content || "";
    this.channel = data.channel_id;//this.client.channels.get(data.channel_id);
    this.author = new User(data.author);
    this.attachments = data.attachments;
    this.embeds = data.embeds;
    this.components = data.components;
    this.timestamp = new Date(data.timestamp);
    this.flags = data.flags;
    this.mentions = {
      everyone: data.mention_everyone,
      users: data.mentions,
      roles: data.mention_roles,
      channels: data.mention_channels
    };
  }

  delete () {
    return this.client.rest.api.channels[this.channel].messages[this.id].delete();
  }

  edit (options) {
    if (typeof (options) === "string") options = { content: options };

    return this.client.rest.api.channels[this.channel].messages[this.id].patch({ data: options });
  }

  addReaction (reaction) {
    return this.client.addMessageReaction(this.id, this.channel, reaction)
  }
};
