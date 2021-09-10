module.exports = (client, { d: data }) => {
  const guild = client.guilds.get(data.guild_id);

  if (guild) {
    for (const member of data.members) {
      guild.members.add(member.user.id, member, client, guild.id);
      client.users.add(member.user.id, member.user, client);
    }
  }
};
