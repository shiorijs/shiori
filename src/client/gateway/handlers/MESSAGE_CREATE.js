"use strict";

module.exports = async (client, { d: data }, shard) => {
  let channel = client.channels.get(data.channel_id);

  if (channel === undefined)
    channel = await client.api.guilds[data.guild_id].channels[data.channel_id].get();

  //if (channel === undefined) return;

  //channel.messages.add(data.id, data);

  const guild = client.guilds.get(data.guild_id);
  let member

  if (guild !== undefined && data.member !== undefined) {
    data.member.user = data.author;
    member = guild.members.add(data.author.id, data.member);
  }

  if (guild !== undefined) data.guild = guild;

  client.emit("messageCreate", data);
}
