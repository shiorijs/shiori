const { MessageComponentTypes} = require("../../utils/Constants");
const Interaction = require("./Interaction");

/**
 * Represents a message component interaction on Discord.
 * @extends {Interaction}
 */
class MessageComponentInteraction extends Interaction {
  /**
   * @param {object} data The interaction data
   * @param {Client} client The instantiating client
   */
  constructor (data, client) {
    super(data, client);
    /**
      * The interaction component type
      * @type {string}
      */
    this.componentType = MessageComponentTypes[data.component_type] ?? "UNKNOWN";

    this._update(data);
  }

  _update (data) {
    if ("custom_id" in data) {
      this.customId = data.custom_id;
    }

    if ("values" in data) {
      this.values = data.values;
    }
  }
}

module.exports = MessageComponentInteraction;
