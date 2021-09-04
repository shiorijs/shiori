const { CommandTypes } = require("../../utils/Constants");

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

    /**
     * Reference object that contains all command informations
     * @typedef {object} ApplicationCommand
     * @property {string} name The application command name
     * @property {string} id The application command id
     * @property {string} type The application command type
     * @property {object} options The application command options
     * @property {object} resolved The application command resolved options
     */

    if (this.type === "APPLICATION_COMMAND") {
      /**
       * Application Command included in this interaction
       * @type {ApplicationCommand}
       */
      this.command = {
        name: data.data.name,
        id: data.data.id,
        type: CommandTypes[data.data.type] ?? "UNKNOWN",
        options: data.data.options ?? [],
        resolved: data.data.resolved ?? {}
      };
    }
  }
}

module.exports = ApplicationCommandInteraction;
