'use strict';

let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (!client.user) {
    client.user = data.user;
    client.users.set(client.user);
  }

  // TODO: Fazer com que o evento ready seja apenas emitido quando todas guilds forem adicionadas
  client.emit("ready");
};
