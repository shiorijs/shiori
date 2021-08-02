'use strict';

module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.get(data.guild_id);

  if (!guild) return;

  data.members.map(member => {
    member.id = member.user.id;

    return guild.members.add(member);
  })
};
