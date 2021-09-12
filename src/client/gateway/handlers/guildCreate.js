module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.add(data.id, data, client);

  if (data.members.length) {
    for (const member of data.members) {
      guild.members.add(member.user.id, member, client, guild.id);
    }
  }

  if (shard._remainingGuilds !== undefined) {
    if (shard._remainingGuilds > 0) shard._remainingGuilds--;
    shard.isReady();
  }

  if (client.rest.options.fetchAllUsers) {
    shard.sendWebsocketMessage({
      op: 8,
      d: {
        guild_id: data.id,
        query: "",
        limit: 0,
        nonce: Date.now().toString() + Math.random().toString(36)
      }
    });
  }
};
