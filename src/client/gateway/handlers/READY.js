module.exports = (client, { d: data }, shard) => {
  if (data.guilds.length) shard._totalGuilds = data.guilds.length;

  if (!client.user) {
    client.user = client.users.add(data.user.id, data.user, client);
  }

  client.emit("shardReady");
  shard.isReady();
};
