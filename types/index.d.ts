import ClientUtils from "../src/client/ClientUtils";
import GatewayManager from "../src/client/gateway/GatewayManager";
import Shard from "../src/client/gateway/Shard";
import RestManager from "../src/rest/RestManager";

export type Snowflake = `${bigint}`;

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

export type ImageFormats = "webp" | "png" | "jpg" | "jpeg" | "gif";
export type ImageSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

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

export interface User {
  public id: Snowflake;
  public username?: string;
  public avatarHash?: string;
  public bot?: boolean;
  public premiumType?: string;
  public flags?: number;
}

export interface Channel {
  public id: Snowflake;
}

export class Collection extends Map {
  public add(id: string, item: object): object;
  public filter(func: Function): Array<Class>;
  public map(func: Function): Array;
  public remove(item: object): Class | undefined;
}
