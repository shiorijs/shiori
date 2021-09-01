const User = require("../../../structures/User");
const Member = require("../../../structures/Member");

module.exports = (client, { d: data }) => {
  const guild = client.guilds.get(data.guild_id);

  if (guild) {
    for (const member of data.members) {
      guild.members.add(member.user.id, new Member(member, client, guild.id));
      client.users.add(member.user.id, new User(member.user, client));
    }
  }
};
