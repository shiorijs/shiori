import ClientUtils from "../src/client/ClientUtils";
import GatewayManager from "../src/client/gateway/GatewayManager";
import Shard from "../src/client/gateway/Shard";
import RestManager from "../src/rest/RestManager";

export class Client {
  public constructor(token: string, options: any);
  public ws: GatewayManager;
  public rest: RestManager;
  public ClientUtils: ClientUtils;
  public plugins: Array<Plugin>;

  public users: Collection<string, User>;
  public channels: Collection<string, Channel>;
  public shards: Collection<string, Shard>;
  public token: string;

  public start(): void;
  public getInformation(type: string, id: string): any;
}

export interface User {
  public id: string;
  public username?: string;
  public avatarHash?: string;
  public bot?: boolean;
  public premiumType?: string;
  public flags?: number;
}

export interface Channel {
  public id: string;
}

export class Collection extends Map {
  public add(id: string, item: object): object;
  public filter(func: Function): Array<Class>;
  public map(func: Function): Array;
  public remove(item: object): Class | undefined;
}
