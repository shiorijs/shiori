const { InteractionTypes } = require("../../utils/Constants");
const Interaction = require("./Interaction");
const ApplicationCommandOptions = require("./ApplicationCommandOptions");

const Message = require("../Message");
const Member = require("../Member");
const Role = require("../Role");
const Channel = require("../Channel");

/**
 * Represents an application command interaction on Discord.
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
     * Reference object that contains all command information
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
       * Application Command structure included in this interaction
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
    * Resolves a target of this interaction.
    * @param {user | message | member | role | channel} targetType The target to be resolved.
    * @returns {User[] | Message[] | Member[] | Role[] | Channel[] | null}
    */
  resolveTarget (targetType) {
    if (this.targetId === undefined || !this.resolved) return null;

    const resolve = {
      user: (id, user) => this.client.users.add(id, user, this.client),
      message: (id, message) => this.channel.messages?.add(id, new Message(message, this.client)),
      member: (id, member) => this.guild.members.add(id, new Member(member, this.client, this.guildId)),
      role: (id, role) => this.guild.roles.add(id, new Role(role, this.client)),
      // eslint-disable-next-line no-unused-vars
      channel: (_, channel) => Channel.transform({ guildId: this.guildId, ...channel }, this.client)
    };

    if (this.resolved[`${targetType}s`]) {
      return Object
        .entries(this.resolved[`${targetType}s`])
        .map(([id, param]) => resolve[targetType](id, param));
    }
  }
}

module.exports = ApplicationCommandInteraction;
