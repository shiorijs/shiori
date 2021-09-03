const Message = require("../../../structures/Message");

module.exports = (client, { d: data }) => {
  const channel = client.utils.getChannel(data.channel_id);
  const message = new Message(data, client);

  if (channel) channel.messages.add(data.id, message);
  else client.emit("warn", `Channel for message "${message.id}" not found, message was not cached.`);

  /**
    * Fired when a message is created.
    * @event Client#messageCreate
    * @prop {Message} message The received message.
    */
  client.emit("messageCreate", message);
};
