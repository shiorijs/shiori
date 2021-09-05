const { InteractionTypes } = require("../../utils/Constants");
const Interaction = require("./Interaction");
const ApplicationCommandOptions = require("./ApplicationCommandOptions");

const Message = require("../Message");
const User = require("../User");
const Member = require("../Member");
const Role = require("../Role");
const Channel = require("../Channel");

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
        * @type {number}
        */
      this.targetType = data.data.type;
    }

    /**
     * Reference object that contains all command informations
     * @typedef {object} ApplicationCommand
     * @property {string} name The application command name
     * @property {string} id The application command id
     * @property {number} type The application command type
     * @property {object} options The application command options
     * @property {object} resolved The application command resolved options
     */

    if (
      this.type === InteractionTypes.APPLICATION_COMMAND &&
      this.targetId === undefined
    ) {
      /**
       * Application Command included in this interaction
       * @type {ApplicationCommand}
       */
      this.command = {
        name: data.data.name,
        id: data.data.id,
        type: data.data.type,
        options: data.data.options ?? []
      };
    }
  }

  /**
    * If this interaction is a context menu, resolve the target.
    * @param {user | message | member | role | channel} targetType The target to be resolved.
    * @returns {User[] | Message[] | Member[] | Role[] | Channel[] | null}
    */
  resolveTarget (targetType) {
    if (this.targetId === undefined || !this.resolved) return null;

    /* eslint-disable no-unused-vars */

    if (targetType === "user" && this.resolved.users) {
      const users = Object.entries(this.resolved.users)
        .map(([_, user]) => new User(user, this.client));

      return users;
    }

    if (targetType === "message" && this.resolved.messages) {
      const messages = Object.entries(this.resolved.messages)
        .map(([_, message]) => new Message(message, this.client));

      return messages;
    }

    if (targetType === "member" && this.resolved.members) {
      const members = Object.entries(this.resolved.members)
        .map(([_, member]) => new Member(member, this.client, this.guildId));

      return members;
    }

    if (targetType === "role" && this.resolved.roles) {
      const roles = Object.entries(this.resolved.roles)
        .map(([_, role]) => new Role(role, this.client));

      return roles;
    }

    if (targetType === "channel" && this.resolved.channels) {
      const channels = Object.entries(this.resolved.channels)
        .map(([_, channel]) => Channel.transform(channel, this.client));

      return channels;
    }
  }
}

module.exports = ApplicationCommandInteraction;
