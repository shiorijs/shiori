import {
  ClientOptions,
  Snowflake
} from "../../typings/index";

//

import EventEmitter from "events";
import Collection from "../utils/Collection";
import GatewayManager from "./gateway/GatewayManager";
import RestManager from "../rest/RestManager";
import PluginsManager from "../managers/PluginsManager";

import Constants from "../utils/Constants";
import Option from "../utils/Option";
import ClientUtils from "./ClientUtils";

class Client extends EventEmitter {
  ws: GatewayManager;
  rest: RestManager;
  utils: ClientUtils;
  options: ClientOptions;
  plugins: Array<String>;
  channelMap: Object;
  guilds: any//Collection;

  constructor (token: string, clientOptions: ClientOptions) {
    super();

    if (!token || typeof (token) !== "string") throw new Error("No token was assigned on \"Client\"!");

    this.options = Option.updateOptionsWithDefaults(clientOptions);

    if (this.options.shardCount <= 0) throw new Error("shardCount cannot be lower or equal to 0");

    this.ws = new GatewayManager(this);
    this.rest = new RestManager(this, clientOptions);
    this.utils = new ClientUtils(this);
    this.plugins = this.options.plugins.map(c => c?.name);

    Object.defineProperties(this, {
      users: { value: new Collection(this.options.cache.users), writable: false },
      guilds: { value: new Collection(this.options.cache.guilds), writable: false },
      shards: { value: new Collection(), writable: false },
      token: { value: token, writable: false },
      channelMap: { value: { }, writable: true }
    });

    if ("intents" in this.options) {
      if (Array.isArray(this.options.intents)) {
        let bitmask = 0;

        for (const intent of this.options.intents) {
          if (Constants.INTENTS[intent]) bitmask |= Constants.INTENTS[intent];
        }

        this.options.intents = bitmask;
      }
    }
  }

  start () {
    const shards = Array.from({ length: this.options.shardCount }, (_, i) => i);

    this.options.shards = [...new Set(shards)];

    try {
      this.ws.createShardConnection();

      if (this.options.plugins.length) new PluginsManager(this, this.options.plugins);
    } catch (error) {
      if (!this.options.autoReconnect) throw error;

      setTimeout(() => this.ws.createShardConnection(), 3000);
    }
  }

  getInformation (type: string, id: Snowflake) {
    return type && id;
  }
}

export default Client;
