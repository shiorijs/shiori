const BaseGuildChannel = require("./BaseGuildChannel");

/**
 * Represents a text channel.
 * @extends {BaseGuildChannel}
 */
class TextChannel extends BaseGuildChannel {
  constructor (data, client) {
    super(data, client);

     this._update(data);
  }

  _update (data) {
    super._update(data);

    if (data.rate_limit_per_user !== undefined) {
      /**
       * The time a user must waits before sending another message in this channel
       * @type {Number}
       */
      this.slowmodeTime = data.rate_limit_per_user;
    }

    if (data.topic) {
      /**
       * The topic of this channel
       * @type {String}
       */
      this.topic = data.topic;
    }
  }
}

module.exports = TextChannel;
