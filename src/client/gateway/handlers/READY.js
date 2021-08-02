'use strict';

let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (!client.user) {
    client.user = data.user;
    client.users.set(client.user);
  }

  client.emit("ready");
};
