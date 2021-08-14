'use strict';

module.exports = (client, { d: data }, shard) => {
  data.shard = shard;
  const guild = client.guilds.add(data.id, data);

  if (data.members.length) {
    for (const member of data.members) {
      guild.members.add(member.user.id, member)
    }
  }

  if (client.options.rest.fetchAllUsers) {
    shard.sendWebsocketMessage({ op: 8, d:
      { guild_id: data.id, query: "", limit: 0, nonce: Date.now().toString() + Math.random().toString(36), }
    })
  }
};
