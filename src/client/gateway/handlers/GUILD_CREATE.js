const Guild = require("../../../structures/Guild");
const Member = require("../../../structures/Member");

module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.add(data.id, new Guild(data, client));

  if (data.members.length) {
    for (const member of data.members) {
      guild.members.add(member.user.id, new Member(member, client, guild.id));
    }
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
