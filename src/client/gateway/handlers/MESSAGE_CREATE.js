const Message = require("../../../structures/Message");
const Utils = require("../../../utils/Utils");

module.exports = (client, { d: data }) => {
  const channel = new Utils(client).getChannel(data.channel_id);
  const message = new Message(data, client);

  if (channel) channel.messages.add(data.id, message);
  else client.emit("warn", `Channel for message "${message.id}" not found, message was not cached.`);

  client.emit("messageCreate", message);
};
