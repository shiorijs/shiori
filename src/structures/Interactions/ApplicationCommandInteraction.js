const { CommandTypes } = require("../../utils/Constants");

const Message = require("../Message");
const User = require("../User");
const Interaction = require("./Interaction");
const ApplicationCommandOptions = require("./ApplicationCommandOptions");

/**
 * Represents an application commmand interaction on Discord.
 * @extends {Interaction}
 */
class ApplicationCommandInteraction extends Interaction {
  /**
   * @param {object} data The interaction data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(data, client);

    /**
      * Application command options manager.
      * @type {ApplicationCommandOptions}
      */
    this.options = new ApplicationCommandOptions(this.client, data.data?.options);

    this._update(data);
  }

  _update (data) {
    super._update(data);

    if ("resolved" in data.data) {
      /**
        * Object that contains a map of user, messages, channels or roles
        * @type {object}
        */
      this.resolved = data.data.resolved;
    }

    if ("target_id" in data.data) {
      /**
        * Context Menu targetId
        * @type {string}
        */
      this.targetId = data.data.target_id;
      /**
        * Context Menu target type
        * @type {string}
        */
      this.targetType = CommandTypes[data.data.type];
    }

    /**
     * Reference object that contains all command informations
     * @typedef {object} ApplicationCommand
     * @property {string} name The application command name
     * @property {string} id The application command id
     * @property {string} type The application command type
     * @property {object} options The application command options
     * @property {object} resolved The application command resolved options
     */


    if (this.isSlashCommand()) {
      /**
       * Application Command included in this interaction
       * @type {ApplicationCommand}
       */
      this.command = {
        name: data.data.name,
        id: data.data.id,
        type: CommandTypes[data.data.type] ?? "UNKNOWN",
        options: data.data.options ?? []
      };
    }
  }

  /**
    * If this interaction is a context menu, resolve the target.
    * @returns {User | Message | null}
    */
  resolveTarget () {
    if (this.targetId === undefined || !this.resolved) return null;

    if (CommandTypes[this.targetType] === CommandTypes.USER) {
      const [userId, user] = Object.entries(this.resolved.users).flat(Infinity);

      return this.client.users.add(userId, new User(user, this.client));
    }

    if (CommandTypes[this.targetType] === CommandTypes.MESSAGE) {
      const [messageId, message] = Object.entries(this.resolved.messages).flat(Infinity);

      return this.channel.messages.add(messageId, new Message(message, this.client));
    }
  }
}

module.exports = ApplicationCommandInteraction;
