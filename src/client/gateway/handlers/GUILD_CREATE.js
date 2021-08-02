'use strict';

module.exports = (client, { d: data }, shard) => {
  data.shard = shard;

  const guild = client.guilds.add(data);

  if (client.options.rest.fetchAllUsers) {
    shard.sendWebsocketMessage({ op: 8, d: { guild_id: data.id, query: "", limit: 0 } })
  }
};
