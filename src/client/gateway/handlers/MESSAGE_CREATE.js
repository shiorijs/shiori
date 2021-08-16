const Message = require("../../../structures/Message");

module.exports = (client, { d: data }, shard) => {
  let channel = client.channels.get(data.channel_id);

  const message = new Message(data, client);
  /*
  if (channel === undefined)
    channel = await client.api.guilds[data.guild_id].channels[data.channel_id].get();*/

  //if (channel === undefined) return;

  //channel.messages.add(data.id, data);

  client.emit("messageCreate", message);
};
