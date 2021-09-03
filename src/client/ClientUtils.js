const Constants = require("../utils/Constants");
const Guild = require("../structures/Guild");
const User = require("../structures/User");

class ClientUtils {
  #client;

  /**
   * @param {Client} client The instantiating client
   */
  constructor (client) {
    this.#client = client;
  }

  /**
    * Gets a channel in the cache.
    * @param {string} channelId The id of the channel to get
    * @returns {?Channel} The channel.
    */
  getChannel (channelId) {
    const guildId = this.#client.channelMap[channelId];

    if (!guildId) return null;

    return this.#client.guilds.get(guildId).channels.get(channelId);
  }

  /**
    * Returns the image of a target.
    * If target is a guild you can use `image(Guild).banner()` or `image(Guild).icon()`
    * If target is a user you can use `image(User).avatar()` or `image(User).default()`
    * @param {User | Guild} target The target to return the image of
    * @returns {Function} The image.
    */
  image (target) {
    const defaultFormat = this.#client.options.defaultFormat;
    const defaultSize = this.#client.options.defaultSize;

    if (target instanceof Guild) {
      return {
        icon (format = defaultFormat, size = defaultSize, dynamic = false) {
          return makeImageUrl(`icons/${target.id}/${target.iconHash}`, format, size, dynamic);
        },
        banner (format = defaultFormat, size = defaultSize, dynamic = false) {
          return makeImageUrl(`banners/${target.id}/${target.iconHash}`, format, size, dynamic);
        }
      };
    }

    if (target instanceof User) {
      return {
        default (size = defaultSize) {
          return makeImageUrl(`embed/avatars/${target.discriminator % 5}`, "png", size, false);
        },
        avatar (format = defaultFormat, size = defaultSize, dynamic = false) {
          return makeImageUrl(`avatars/${target.id}/${target.avatarHash}`, format, size, dynamic);
        }
      };
    }

    throw new Error("Invalid target");
  }

  /**
   * setTimeout but as a promise.
   * @param {number} ms Timeout in MS
   * @returns {Promise<boolean>}
   */
  delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
}

function makeImageUrl (root, format, size, dynamic) {
  const { ImageFormats, ImageSizes } = Constants;

  if (format && !ImageFormats.includes(format)) throw new Error(`Invalid image format: ${format}`);
  if (size && !ImageSizes.includes(size)) throw new RangeError(`Invalid image size: ${size}`);

  if (dynamic) format = root.split("/").slice(-1)[0].startsWith("a_") ? "gif" : format;

  return `https://cdn.discordapp.com/${root}.${format ?? "webp"}${size ? `?size=${size}` : ""}`;
}

module.exports = ClientUtils;
