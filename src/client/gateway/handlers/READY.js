const User = require("../../../structures/User");

module.exports = (client, { d: data }) => {
  if (!client.user) {
    client.user = data.user;
    client.users.add(client.user.id, new User(client.user, client));
  }

  // TODO: Fazer com que o evento ready seja apenas emitido quando todas guilds forem adicionadas
  client.emit("ready");
};
