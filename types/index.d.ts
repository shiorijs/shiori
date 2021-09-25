import EventEmitter from "events";
import WebSocket from "ws";
import AsyncQueue from "../src/utils/AsyncQueue";

import {
  Snowflake,
  RolePayload
} from "./payloads";

// Types

export type HTTPMethods = "get" | "post" | "patch" | "put" | "delete" | "head";
export type InteractionMessageCreateOptions = Omit<MessageCreateOptions, "file">;
export type ImageFormats = "webp" | "png" | "jpg" | "jpeg" | "gif";
export type ImageSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export type AllowedMessageMentions = "roles" | "users" | "everyone";
export type EmbedType = "rich" | "image" | "video" | "gifv" | "article" | "link";

// Gateway and Rest
export type IntentsFlags = keyof Constants["INTENTS"];

export type GuildFeatures =
  "ANIMATED_ICON" | "BANNER" | "COMMERCE" | "COMMUNITY" | "DISCOVERABLE" | "FEATURABLE"              |
  "INVITE_SPLASH" | "MEMBER_VERIFICATION_GATE_ENABLED" | "NEWS" | "PARTNERED" | "PREVIEW_ENABLED"    |
  "VANITY_URL" | "VERIFIED" | "VIP_REGIONS" | "WELCOME_SCREEN_ENABLED" | "TICKETED_EVENTS_ENABLED"   |
  "MONETIZATION_ENABLED" | "MORE_STICKERS" | "THREE_DAY_THREAD_ARCHIVE" | "SEVEN_DAY_THREAD_ARCHIVE" |
  "PRIVATE_THREADS";

// Enums

export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13
}

export enum InteractionTypes {
  PING = 1,
  APPLICATION_COMMAND	= 2,
  MESSAGE_COMPONENT	= 3
}

export enum MessageType {
  DEFAULT	= 0,
  RECIPIENT_ADD	= 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE =	4,
  CHANNEL_ICON_CHANGE =	5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7,
  USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  APPLICATION_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22
}

export enum GuildVerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4
}

export enum ApplicationCommandOptionTypes {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10
}

export enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3
}

export enum ApplicationCommandTypes {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3
}

export enum ApplicationCommandPermissionTypes {
  ROLE = 1,
  USER = 2
}

// Interfaces

export interface WSOptions {
  version: number;
}

export interface RestOptions {
  version: number;
  fetchAllUsers: boolean;
  timeout: number;
}

export interface CacheOptions<K, V> {
  toAdd: (value: V, key: K) => boolean;
  toRemove: (value: V, key: K) => boolean;
  limit: number;
  sweep: number;
  sweepTimeout: number;
}

export interface ClientCache {
  users: CacheOptions<Snowflake, User>;
  guilds: CacheOptions<Snowflake, Guild>;
  messages: CacheOptions<Snowflake, Message>;
  roles: CacheOptions<Snowflake, Role>;
}

export interface ClientOptions {
  ws: WSOptions;
  rest: RestOptions;
  intents: number | IntentsFlags[];
  shardCount: number;
  blockedEvents: string[];
  autoReconnect: boolean;
  connectionTimeout: number;
  plugins: string[];
  cache: ClientCache;
  defaultFormat: ImageFormats;
  defaultSize: ImageSizes;
}

export interface AFKChannel {
  channelId?: Snowflake;
  timeout?: number;
}

export interface PermissionOverwrite {
  id: Snowflake;
  type: number;
  allow: string;
  deny: string;
}

export interface GuildBoost {
  level: number;
  amount: number;
}

export interface GuildWidget {
  enabled: boolean;
  channelId: Snowflake;
}

// TODO: Eu coloquei os parametros do discord e não os parametros da função, precisa ser mudado.
export interface MessageCreateOptions {
  content: string;
  tts: boolean;
  file: any;
  embeds: MessageEmbed[];
  payload_json: string;
  allowed_mentions: AllowedMessageMentions;
  message_reference: MessageReference;
  components: MessageComponents[];
  sticker_ids: Snowflake[];
}

export interface MessageReference {
  message_id?: Snowflake;
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  fail_if_not_exists: boolean;
}

export interface ShardMessageOptions {
  op: number;
  d: never;
}

// TODO
export interface MessageEditOptions {
  content: string;
}

export interface MessageMentions {
  everyone: boolean;
  users: Snowflake[];
  roles: Snowflake[];
  channels: Snowflake[];
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedImage {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnail {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideo {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedProvider {
  name?: string;
  url?: string;
}

export interface EmbedAuthor {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface MessageEmbed {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export interface Constants {
  REST: {
    BASE_URL: "https://discord.com/api";
    API_VERSION: 9;
  };
  GATEWAY: {
    BASE_URL: "wss://gateway.discord.gg/";
    VERSION: 9;
  };
  OP_CODES: {
    EVENT: 0;
    HEARTBEAT: 1;
    IDENTIFY: 2;
    STATUS_UPDATE: 3;
    VOICE_STATE_UPDATE: 4;
    VOICE_GUILD_PING: 5;
    RESUME: 6;
    RECONNECT: 7;
    REQUEST_GUILD_MEMBERS: 8;
    INVALID_SESSION: 9;
    HELLO: 10;
    HEARTBEAT_ACK: 11;
  };
  INTENTS: {
    GUILDS: 1;
    GUILD_MEMBERS: 2;
    GUILD_BANS: 4;
    GUILD_EMOJIS: 8;
    GUILD_INTEGRATIONS: 16;
    GUILD_WEBHOOKS: 32;
    GUILD_INVITES: 64;
    GUILD_VOICE_STATES: 128;
    GUILD_PRESENCES: 256;
    GUILD_MESSAGES: 512;
    GUILD_MESSAGE_REACTIONS: 1024;
    GUILD_MESSAGE_TYPING: 2048;
    DIRECT_MESSAGES: 4096;
    DIRECT_MESSAGE_REACTIONS: 8192;
    DIRECT_MESSAGE_TYPING: 16384;
  };
  ChannelTypes: {
    GUILD_TEXT: 0;
    DM: 1;
    GUILD_VOICE: 2;
    GROUP_DM: 3;
    GUILD_CATEGORY: 4;
    GUILD_NEWS: 5;
    GUILD_STORE: 6;
    GUILD_NEWS_THREAD: 10;
    GUILD_PUBLIC_THREAD: 11;
    GUILD_PRIVATE_THREAD: 12;
    GUILD_STAGE_VOICE: 13;
  };
  MessageComponentTypes: {
    ACTION_ROW: 1;
    BUTTON: 2;
    SELECT_MENU: 3;
  };
  InteractionTypes: {
    PING: 1;
    APPLICATION_COMMAND: 2;
    MESSAGE_COMPONENT: 3;
  };
  InteractionResponseTypes: {
    PONG: 1;
    CHANNEL_MESSAGE_WITH_SOURCE: 4;
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5;
    DEFERRED_UPDATE_MESSAGE: 6;
    UPDATE_MESSAGE: 7;
  };
  CommandTypes: {
    CHAT_INPUT: 1;
    USER: 2;
    MESSAGE: 3;
  };
  CommandOptionTypes: {
    SUB_COMMAND: 1;
    SUB_COMMAND_GROUP: 2;
    STRING:	3;
    INTEGER: 4;
    BOOLEAN: 5;
    USER:	6;
    CHANNEL: 7;
    ROLE:	8;
    MENTIONABLE: 9;
    NUMBER:	10;
  };
  GatewayErrors: {
    UNKNOWN: 4000;
    UNKNOWN_OPCODE: 4001;
    DECODE_ERROR: 4002;
    NOT_AUTHENTICATED: 4003;
    AUTHENTICATION_FAILED: 4004;
    ALREADY_AUTHENTICATED: 4005;
    INVALID_SEQUENCE: 4007;
    RATE_LIMITED: 4008;
    INVALID_SESSION: 4009;
    INVALID_SHARD: 4010;
    SHARDING_REQUIRED: 4011;
    INVALID_API_VERSION: 4012;
    INVALID_INTENT: 4013;
    DISALLOWED_INTENT: 4014;
  };
  ImageFormats: ["webp", "png", "jpg", "jpeg", "gif"];
  ImageSizes: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
}

// TODO
export interface MessageComponents {
  custom_id: string;
}

export interface MessageAttachments {
  id: Snowflake;
  size: number;
  filename: string;
  url: string;
  proxy_url: string;
  content_type?: string;
  height?: number;
  width?: number;
}

export interface ApplicationCommandOptionChoice {
  name: string;
  value: string | number;
}

export interface ApplicationCommandPermission {
 id: Snowflake;
 type: ApplicationCommandPermissionTypes;
 permission: boolean;
}

export interface ApplicationCommandOption {
  type: ApplicationCommandOptionTypes;
  name: string;
  description: string;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOption[];
  channel_types?: ChannelType[];
}

// TUDO DEVE SER ALTERADO PARA PARTIAL
export interface ApplicationCommandResolve {
  users?: Map<Snowflake, User>;
  members?: Map<Snowflake, Member>;
  roles?: Map<Snowflake, Role>;
  channels?: Map<Snowflake, Channel>;
  messages?: Map<Snowflake, Message>;
}

export interface ApplicationCommand {
  name: string;
  id: Snowflake;
  type: ApplicationCommandTypes;
  options?: ApplicationCommandOption[];
  default_permission?: boolean;
}

export interface RoleTags {
  botId: Snowflake;
  integrationId: Snowflake;
  premiumSubscriber: null;
}

// Classes

export class RestManager {
  public constructor(client: Client, options: RestOptions);
  private handlers: LimitedCollection<string, Bucket>;
  public options: RestOptions;
  public client: Client;
  public userAgent: string;
  public apiURL: string;
  // TODO: Better type for api
  public readonly api: unknown;
  // TODO: Better type for options
  public request(method: HTTPMethods, url: string, options: object): void;
  public routefy(url: string): string;
  private resolveRequest(method: HTTPMethods, url: string, options: object);
}

export class Bucket {
  public constructor(manager: RestManager);
  private asyncQueue: AsyncQueue;
  public remaining: number;
  public reset: Date;
  public readonly inactive: boolean;
  public readonly globalLimited: boolean;
  public readonly localLimited: boolean;
  // TODO: Better type for options
  public queueRequest(path: string, options: object, route: string): Promise<unknown>;
  public executeRequest(path: string, options: object, route: string): Promise<unknown>;
}

export class Client {
  public constructor(token: string, options: ClientOptions);
  public gateway: GatewayManager;
  public rest: RestManager;
  public utils: ClientUtils;
  public plugins: string[];
  public users: UsersCache;
  public guilds: GuildsCache;
  public token: string;
  public channelMap: object;
  public start(): void;
  public getInformation(type: string, id: Snowflake): any;
}

export class ClientUtils {
  private client: Client;
  public getChannel(channelId: Snowflake): Channel;
  public image(target: Guild | User): () => void; // Especificar melhor a callback
}

export class Base {
  private client: Client;
  public _update(data: any): void;
}

export class User extends Base {
  public id: Snowflake;
  public username: string;
  public bot: boolean;
  public avatarHash?: string;
  public premiumType?: number;
  public flags?: number;
}

export class Message extends Base {
  public id: Snowflake;
  public channelId: Snowflake;
  public guildId: Snowflake;
  public author: User;
  public content: string;
  public timestamp: Date;
  public type: MessageType;
  public mentions?: MessageMentions;
  public attachments?: MessageAttachments[];
  public embeds?: MessageEmbed[];
  public flags?: number;
  public components?: MessageComponents[];
  public readonly deletable: boolean;
  public readonly editable: boolean;
  public readonly channel: Channel | null;
  public readonly guild: Guild | null;
  public delete(): Promise<void>;
  public addReaction(reaction: string): Promise<void>;
  public edit(options: MessageEditOptions): Promise<void>;
}

export class Channel extends Base {
  public id: Snowflake;
}

export class BaseGuildChannel extends Channel {
  public id: Snowflake;
  public name: string;
  public position: number;
  public parentId: Snowflake;
  public nsfw: boolean;
  public guildId: Snowflake;
  public type: ChannelType;
  public messages: LimitedCollection<Snowflake, Message>;
}

export class TextChannel extends BaseGuildChannel {
  public slowmodeTime?: number;
  public topic?: string;
  public permissionOverwrites?: PermissionOverwrite[];
  public lastMessage?: Message | { id: Snowflake };
  public send(options: MessageCreateOptions): Message;
}

export class Member extends Base {
  public id: Snowflake;
  public guildId: Snowflake;
  public joinedAt: Date;
  public nick?: string;
  public roles?: Snowflake[];
  public permissions?: string[];
  public readonly user: User;
  public readonly guild: Guild | null;
}

export class Guild extends Base {
  public ownerId: Snowflake;
  public name: string;
  public verificationLevel: GuildVerificationLevel;
  public members: LimitedCollection<Snowflake, Member>;
  public roles: LimitedCollection<Snowflake, Role>;
  public channels: LimitedCollection<Snowflake, Channel>;
  public afk?: AFKChannel;
  public widget?: GuildWidget;
  public emojis?: Snowflake[];
  public features?: GuildFeatures[];
  public iconHash?: string;
  public bannerHash: string;
  public description?: string;
  public boost?: GuildBoost;
  public readonly owner: User | null;
}

export class Interaction extends Base {
  public id: Snowflake;
  public responded: boolean;
  public type: InteractionTypes;
  public applicationId: Snowflake;
  public channelId: Snowflake;
  public guildId: Snowflake;
  public userId?: Snowflake;
  public member?: Member;
  private token: string;
  public readonly user: User;
  public readonly guild: Guild;
  public readonly channel: Channel;
  public isContextMenu(): boolean;
  public isCommand(): boolean;
  public isSelectMenu(): boolean;
  public isButton(): boolean;
  public transform(data: object, client: Client):
    ApplicationCommandInteraction | MessageComponentInteraction | Interaction;
  public reply(options: InteractionMessageCreateOptions): Promise<Message>;
  public createFollowup(options: InteractionMessageCreateOptions): Promise<Message>;
  public defer(ephemeral: boolean): Promise<Message>;
  public delete(messageId: string): Promise<void>;
  public edit(options: MessageEditOptions | string): Promise<void>;
  public getMessage(messageId: string): Promise<Message>;
}

export class Role extends Base {
  public constructor(data: RolePayload, client: Client);
  public id: Snowflake;
  public managed: boolean;
  public tags: RoleTags;
  public name: string;
  public color: number;
  public hoisted: boolean;
  public position: number;
  public mentionable: boolean;
  public permissions: string;
}

export class Shard extends EventEmitter {
  public constructor(manager: GatewayManager, id: number);
  public id: number;
  public sessionId: string | null;
  public reconnectInterval: number;
  public reconnectAttempts: number;
  public sequence: number;
  public lastHeartbeatAcked: boolean;
  public heartbeatInterval: NodeJS.Timeout;
  // TODO: Mudar para uma union dentro de um type
  public status: string;
  public lastHeartbeatReceived: number;
  public lastHeartbeatSent: Date;
  public _remainingGuilds: number;
  public _guildQueueTimeout: NodeJS.Timeout;
  private client: Client;
  private manager: GatewayManager;
  private connection: WebSocket;
  public setDefaultProperties(): void;
  public connect(): void;
  public isReady(): void;
  public packetReceive(packet: object): void;
  public disconnect(reconnect: boolean): void;
  public sendWebsocketMessage(data: ShardMessageOptions): void;
  private websocketError(error: Error): void;
  private websocketMessageReceive(data: object): void;
  private websocketConnectionOpen(): void;
  private websocketCloseConnection(): void;
  private identify(): void;
  private sendHeartbeat(): void;
}

export class GatewayManager {
  public shards: Collection<number, Shard>;
  public websocketURL: string;
  private client: Client;
  public connect(): void;
  public handlePacket(packet: object, shard: Shard): void;
}

export class ApplicationCommandInteraction extends Interaction {
  public command: ApplicationCommand;
  public resolved: ApplicationCommandResolve;
  public targetId: Snowflake;
  public targetType: ApplicationCommandTypes;
  public options: ApplicationCommandOptions;
  public resolveTarget(targetType: "user" | "message" | "member" | "role"):
    User[] | Message[] | Member[] | Role[] | Channel[] | null;
}

export class MessageComponentInteraction extends Interaction {
  public componentType: MessageComponentTypes;
  public customId: string;
  public values?: string[];
}

export class ApplicationCommandOptions {
  public subcommand: string | null;
  public subcommandGroup: string | null;
  public string(optionName: string): boolean;
  public integer(optionName: string): boolean;
  public boolean(optionName: string): boolean;
  public user(optionName: string, resolve: boolean): boolean;
  public channel(optionName: string, resolve: boolean): boolean;
  public role(optionName: string): boolean;
  public number(optionName: string): boolean;
}

export class Cache<K, V> {
  public constructor(cacheOptions: CacheOptions<K, V>);
  public cache: LimitedCollection<K, V> | Collection<K, V>;
  public limited: boolean;
  public get(key: K): V | null;
  public add(key: K, value: V, extra: unknown[]): V;
  public filter(callback: (value: V, key: K) => boolean): K[];
  public find(callback: (value: V, key: K) => boolean): unknown[];
  public map(callback: (value: V, key: K) => unknown): V[];
  public remove(key: K): V | null;
}

export class GuildsCache extends Cache<Snowflake, Guild> {
  public constructor(client: Client);
  public fetch(guildId: string): Promise<Guild>;
}

export class UsersCache extends Cache<Snowflake, User> {
  public constructor(client: Client);
  public fetch(userId: string): Promise<User>;
}

export class Collection<K, V> extends Map<K, V> {
  public add(key: K, value: V, extra: unknown[]): V;
  public filter(callback: (value: V, key: K) => boolean): K[];
  public find(callback: (value: V, key: K) => boolean): unknown[];
  public map(callback: (value: V, key: K) => unknown): V[];
  public remove(key: K): V | null;
}

export class LimitedCollection<K, V> extends Collection<K, V> {
  private sweep(): void;
}
