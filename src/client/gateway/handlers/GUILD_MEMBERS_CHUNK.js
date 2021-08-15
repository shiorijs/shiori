"use strict";

module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.get(data.guild_id);

  if (!guild) return;

  for (const member of data.members) {
    guild.members.add(member.user.id, member);
    client.users.add(member.user.id, member.user);
  }
};
