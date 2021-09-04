module.exports = {
  REST: {
    BASE_URL: "https://discord.com/api",
    API_VERSION: 9
  },
  OP_CODES: {
    EVENT: 0,
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
    HEARTBEAT_ACK: 11
  },
  INTENTS: {
    GUILDS:                   1 << 0,
    GUILD_MEMBERS:            1 << 1,
    GUILD_BANS:               1 << 2,
    GUILD_EMOJIS:             1 << 3,
    GUILD_INTEGRATIONS:       1 << 4,
    GUILD_WEBHOOKS:           1 << 5,
    GUILD_INVITES:            1 << 6,
    GUILD_VOICE_STATES:       1 << 7,
    GUILD_PRESENCES:          1 << 8,
    GUILD_MESSAGES:           1 << 9,
    GUILD_MESSAGE_REACTIONS:  1 << 10,
    GUILD_MESSAGE_TYPING:     1 << 11,
    DIRECT_MESSAGES:          1 << 12,
    DIRECT_MESSAGE_REACTIONS: 1 << 13,
    DIRECT_MESSAGE_TYPING:    1 << 14
  },
  WSEvents: [
    "READY",
    "RESUMED",
    "APPLICATION_COMMAND_CREATE",
    "APPLICATION_COMMAND_DELETE",
    "APPLICATION_COMMAND_UPDATE",
    "GUILD_CREATE",
    "GUILD_DELETE",
    "GUILD_UPDATE",
    "INVITE_CREATE",
    "INVITE_DELETE",
    "GUILD_MEMBER_ADD",
    "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBER_UPDATE",
    "GUILD_MEMBERS_CHUNK",
    "GUILD_INTEGRATIONS_UPDATE",
    "GUILD_ROLE_CREATE",
    "GUILD_ROLE_DELETE",
    "GUILD_ROLE_UPDATE",
    "GUILD_BAN_ADD",
    "GUILD_BAN_REMOVE",
    "GUILD_EMOJIS_UPDATE",
    "CHANNEL_CREATE",
    "CHANNEL_DELETE",
    "CHANNEL_UPDATE",
    "CHANNEL_PINS_UPDATE",
    "MESSAGE_CREATE",
    "MESSAGE_DELETE",
    "MESSAGE_UPDATE",
    "MESSAGE_DELETE_BULK",
    "MESSAGE_REACTION_ADD",
    "MESSAGE_REACTION_REMOVE",
    "MESSAGE_REACTION_REMOVE_ALL",
    "MESSAGE_REACTION_REMOVE_EMOJI",
    "THREAD_CREATE",
    "THREAD_UPDATE",
    "THREAD_DELETE",
    "THREAD_LIST_SYNC",
    "THREAD_MEMBER_UPDATE",
    "THREAD_MEMBERS_UPDATE",
    "USER_UPDATE",
    "PRESENCE_UPDATE",
    "TYPING_START",
    "VOICE_STATE_UPDATE",
    "VOICE_SERVER_UPDATE",
    "WEBHOOKS_UPDATE",
    "INTERACTION_CREATE",
    "STAGE_INSTANCE_CREATE",
    "STAGE_INSTANCE_UPDATE",
    "STAGE_INSTANCE_DELETE"
  ],
  ChannelTypes: createEnum([
    "GUILD_TEXT", // A text channel within a server
    "DM", // A direct message between users
    "GUILD_VOICE", // A voice channel within a server
    "GROUP_DM", // A direct message between multiple users
    "GUILD_CATEGORY", // An organizational category that contains up to 50 channels
    "GUILD_NEWS", // A channel that users can follow and crosspost into their own server
    "GUILD_STORE", // A channel in which game developers can sell their game on Discord
    ...Array(3).fill(null),
    "GUILD_NEWS_THREAD", // A temporary sub-channel within a GUILD_NEWS channel
    "GUILD_PUBLIC_THREAD", // A temporary sub-channel within a GUILD_TEXT channel
    "GUILD_PRIVATE_THREAD", // A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
    "GUILD_STAGE_VOICE" // A voice channel for hosting events with an audience
  ]),
  MessageComponentTypes: createEnum([null, "ACTION_ROW", "BUTTON", "SELECT_MENU"]),
  InteractionTypes: createEnum([null, "PING", "APPLICATION_COMMAND", "MESSAGE_COMPONENT"]),
  InteractionResponseTypes: {
    PONG: 1,
    CHANNEL_MESSAGE_WITH_SOURCE: 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
    DEFERRED_UPDATE_MESSAGE: 6,
    UPDATE_MESSAGE: 7
  },
  CommandOptionTypes: {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING:	3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER:	6,
    CHANNEL:7,
    ROLE:	8,
    MENTIONABLE:9,
    NUMBER:	10
  },
  CommandTypes: createEnum([
    null,
    "CHAT_INPUT",
    "USER",
    "MESSAGE"
  ]),
  GatewayErrors: {
    UNKNOWN: 4000,
    UNKNOWN_OPCODE: 4001,
    DECODE_ERROR: 4002,
    NOT_AUTHENTICATED: 4003,
    AUTHENTICATION_FAILED: 4004,
    ALREADY_AUTHENTICATED: 4005,
    INVALID_SEQUENCE: 4007,
    RATE_LIMITED: 4008,
    INVALID_SESSION: 4009,
    INVALID_SHARD: 4010,
    SHARDING_REQUIRED: 4011,
    INVALID_API_VERSION: 4012,
    INVALID_INTENT: 4013,
    DISALLOWED_INTENT: 4014
  },
  ImageFormats: ["webp", "png", "jpg", "jpeg", "gif"],
  ImageSizes: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
};

function createEnum (keys) {
  const obj = {};

  for (const [index, key] of keys.entries()) {
    if (key === null) continue;

    obj[key] = index; obj[index] = key;
  }

  return obj;
}
