module.exports.OP_CODES = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  STATUS_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
  VOICE_GUILD_PING: 5,
  RESUME: 6,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11,
};

module.exports.INTENTS = {
  guilds:                 1 << 0,
  guildMembers:           1 << 1,
  guildBans:              1 << 2,
  guildEmojis:            1 << 3,
  guildIntegrations:      1 << 4,
  guildWebhooks:          1 << 5,
  guildInvites:           1 << 6,
  guildVoiceStates:       1 << 7,
  guildPresences:         1 << 8,
  guildMessages:          1 << 9,
  guildMessageReactions: 1 << 10,
  guildMessageTyping: 1 << 11,
  directMessages: 1 << 12,
  directMessageReactions: 1 << 13,
  directMessageTyping: 1 << 14
};
