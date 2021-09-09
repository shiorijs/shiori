import EventEmitter from "events";
import ClientUtils from "../src/client/ClientUtils";
import GatewayManager from "../src/client/gateway/GatewayManager";
import Shard from "../src/client/gateway/Shard";
import RestManager from "../src/rest/RestManager";

// Types

export type InteractionMessageCreateOptions = Omit<MessageCreateOptions, "file">;
export type Snowflake = `${bigint}`;
export type ImageFormats = "webp" | "png" | "jpg" | "jpeg" | "gif";
export type ImageSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export type AllowedMessageMentions = "roles" | "users" | "everyone";
export type EmbedType = "rich" | "image" | "video" | "gifv" | "article" | "link";
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
};

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

export interface ClientEvents {
  ready: [];
  messageCreate: [message: Message];
  interactionCreate: [interaction: Interaction];
}

export interface WSOptions {
  version: number;
}

export interface RestOptions {
  version: number;
  fetchAllUsers: boolean
}

export interface CacheOptions {
  limit: number;
  toAdd: (value: object, key: Snowflake | unknown) => boolean;
  toRemove: (value: object, key: Snowflake | unknown) => boolean;
  sweep: number;
  sweepTimeout: number
}

export interface ClientCache {
  users: CacheOptions;
  guilds: CacheOptions;
}

export interface ClientOptions {
  ws: WSOptions;
  rest: RestOptions;
  intents: Array<string> | number;
  shardCount: number;
  blockedEvents: Array<string>;
  autoReconnect: boolean;
  connectionTimeout: number;
  plugins: Array<typeof Class>;
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

// TODO
export interface MessageEditOptions {

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

// TODO
export interface MessageComponents {

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
}

// TUDO DEVE SER ALTERADO PARA PARTIAL
export interface ApplicationCommandResolve {
  users?: Map<Snowflake, User>;
  members?: Map<Snowflake, Member>;
  roles?: Map<Snowflake, Role>; // TODO: ROLE
  channels?: Map<Snowflake, Channel>;
  messages?: Map<Snowflake, Message>;
}

export interface ApplicationCommand {
  name: string;
  id: Snowflake;
  type: ApplicationCommandTypes | "UNKNOWN";
  options?: ApplicationCommandOption[];
  default_permission?: boolean;
}

// Classes

export class Client extends EventEmitter {
  public constructor(token: string, options: ClientOptions);
  public ws: GatewayManager;
  public rest: RestManager;
  public utils: ClientUtils;
  public plugins: Array<Plugin>;

  public users: Collection<Snowflake, User>;
  public channels: Collection<Snowflake, Channel>;
  public shards: Collection<Snowflake, Shard>;
  public token: string;

  public start(): void;
  public getInformation(type: string, id: Snowflake): any;
  emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
  emit(event: string, ...args: any[]): boolean;
  on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
  once(event: string, listener: (...args: any[]) => void): this;
  off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;
}

export class ClientUtils {
  private client: Client;
  public getChannel(channelId: snowflake): Channel;
  public image(target: Guild | User): Function // Especificar melhor a callback
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
  public async delete(): void;
  public async addReaction(reaction: string): void;
  public async edit(options: MessageEditOptions): void;
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
  public type: ChannelType | "UNKNOWN";
  public messages: Collection<Snowflake, Message>;
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
  public members: Collection<Snowflake, Member>;
  public afk?: AFKChannel;
  public widget?: GuildWidget;
  public roles?: Snowflake[];
  public emojis?: Snowflake[];
  public features?: GuildFeatures[];
  public iconHash?: string;
  public bannerHash: string;
  public description?: string;
  public boost?: GuildBoost;
  public channels?: Collection<Snowflake, Channel>;
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
  public async reply(options: InteractionMessageCreateOptions): Message;
  public async createFollowup(options: InteractionMessageCreateOptions): Message
  public async defer(ephemeral: boolean): Message;
  public async delete(messageId: string): Promise<void>;
  public async edit(options: MessageEditOptions | string): Promise<void>;
  public async getMessage(messageId: string): Message;
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
  public componentType: MessageComponentTypes | "UNKNOWN";
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

export class Collection<K, V> extends Map<K, V> {
  public add(id: K, item: V): V;
  public filter(func: (id: K, item: V) => boolean): Array<V>;
  public map(func: (item: V) => unknown): Array<V>;
  public remove(item: K): V | undefined;
}
