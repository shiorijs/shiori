const User = require("../../../structures/User");

module.exports = (client, { d: data }, shard) => {
  if (!client.user) {
    client.user = data.user;
    client.users.set(client.user.id, new User(client.user, client));
  }

  // TODO: Fazer com que o evento ready seja apenas emitido quando todas guilds forem adicionadas
  client.emit("ready");
};
