import ClientUtils from "../src/client/ClientUtils";
import GatewayManager from "../src/client/gateway/GatewayManager";
import Shard from "../src/client/gateway/Shard";
import RestManager from "../src/rest/RestManager";

export type Snowflake = `${bigint}`;

// Types

export type ImageFormats = "webp" | "png" | "jpg" | "jpeg" | "gif";
export type ImageSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export type AllowedMessageMentions = "roles" | "users" | "everyone";

// Enums
export enum ChannelTypes = {

};

// Interfaces

export interface WSOptions {
  version: number;
}

export interface RestOptions {
  version: number;
  fetchAllUsers: boolean
}

export interface CacheOptions {
  limit: number,
  toAdd: function,
  toRemove: function,
  sweep: number,
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

export interface GuildBoost {
  level: number; // Mudar para um enum.
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
  file: any; // 😭 discord só fala que é um arquivo :(
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

// TODO
export interface MessageMentions {

}

// TODO
export interface MessageEmbed {

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

// Classes

export class Client {
  public constructor(token: string, options: ClientOptions);
  public ws: GatewayManager;
  public rest: RestManager;
  public ClientUtils: ClientUtils;
  public plugins: Array<Plugin>;

  public users: Collection<Snowflake, User>;
  public channels: Collection<Snowflake, Channel>;
  public shards: Collection<Snowflake, Shard>;
  public token: string;

  public start(): void;
  public getInformation(type: string, id: Snowflake): any;
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
  public mentions?: MessageMentions;
  public attachments?: MessageAttachments[];
  public embeds?: MessageEmbed[];
  public type?: number; // Mudar para um enum
  public flags?: number;
  public components?: MessageComponents[];
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
  public type: ChannelTypes | "UNKNOWN";
  public messages: Collection<Snowflake, Message>;
}

export class TextChannel extends BaseGuildChannel {
  public slowmodeTime?: number;
  public topic?: string;
  public send(options: MessageCreateOptions): Message;
}

export class Member extends Base {
  public id: Snowflake;
  public guildId: Snowflake;
  public joinedAt: Date;
  public nick?: string;
  public roles?: Snowflake[];
  public permissions?: string[];
}

export class Guild extends Base {
  public ownerId: Snowflake;
  public name: string;
  public verificationLevel: number; // Mudar para um enum
  public members: Collection<Snowflake, Member>;
  public afk?: AFKChannel;
  public widget?: GuildWidget;
  public roles?: Snowflake[];
  public emojis?: Snowflake[];
  public features?: string[]; // Mudar string para um enum;
  public iconHash?: string;
  public bannerHash: string;
  public description?: string;
  public boost?: GuildBoost;
  public channels?: Collection<Snowflake, Channel>;
}

// TODO
export class Interaction extends Base {

}

export class Collection extends Map {
  public add(id: string, item: object): object;
  public filter(func: Function): Array<Class>; // Class não existe, mudar
  public map(func: Function): Array; // Especificar melhor a callback
  public remove(item: object): Class | undefined; // Class não existe
}
