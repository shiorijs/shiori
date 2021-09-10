const Base = require("./Base");
const Channel = require("./Channel");
const LimitedCollection = require("../utils/LimitedCollection");

/**
  * Represents a discord guild
  * @extends {Base}
  */
class Guild extends Base {
  /**
   * @param {object} data The guild structure data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(client);

    const cache = client.options.cache;

    /**
     * Members that belongs to this guild
     * @type {LimitedCollection<String, Member>}
     * @name Guild#members
     */
    Object.defineProperty(this, "members", { value: new LimitedCollection(cache.members), writable: true });

    /**
     * Channels that belongs to this guild
     * @type {LimitedCollection<String, Channel>}
     * @name Guild#channels
     */
    Object.defineProperty(this, "channels", { value: new LimitedCollection(cache.channels), writable: true });

    /**
     * The guildId
     * @type {string}
     */
    this.id = data.id;

    this._update(data);
  }

  _update (data) {
    /**
      * The owner id from the guild
      * @type {string}
      */
    this.ownerId = data.owner_id;

    /**
      * The guild name
      * @type {string}
      */
    this.name = data.name;

    this.verificationLevel = data.verification_level;

    if ("afk_channel_id" in data || "afk_timeout" in data) {
      this.afk = { channelId: data.afk_channel_id, timeout: data.afk_timeout };
    }

    if ("widget_enabled" in data || "widget_channel_id" in data) {
      this.widget = { enabled: Boolean(data.widget_enabled), channelId: data.widget_channel_id };
    }

    if (data.roles?.length) {
      this.roles = data.roles.map(r => r.id);
    }

    if (data.emojis?.length) {
      this.emojis = data.emojis.map(e => e.id);
    }

    if ("features" in data) {
      this.features = data.features;
    }

    if ("icon" in data) {
      /**
       * The guild icon hash
       * @type {string}
       */
      this.iconHash = data.icon;
    }

    if ("description" in data) {
      /**
       * The guild community description
       * @type {string}
       */
      this.description = data.description;
    }

    if (data.banner !== null) {
      /**
       * The guild banner hash
       * @type {string}
       */
      this.bannerHash = data.banner;
    }

    if (data.premium_tier !== undefined || data.premium_subscription_count !== undefined) {
      this.boost = { level: data.premium_tier, amount: data.premium_subscription_count ?? 0 };
    }

    if ("channels" in data) {
      for (const _channel of data.channels) {
        _channel.guildId = this.id;
        const channel = Channel.transform(_channel, this.client);

        if (!channel.id) continue;

        this.channels.add(channel.id, channel);
        this.client.channelMap[channel.id] = this.id;
      }
    }
  }

  /**
   * The owner of the guild
   * @type {?User}
   * @readonly
   */
  get owner () {
    return this.client.users.get(this.ownerId) ?? null;
  }
}

module.exports = Guild;
