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
      * @type {number}
      */
    this.componentType = data.data.component_type;

    this._update(data.data);
  }

  _update (data) {
    if ("custom_id" in data) {
      /**
        * The customId of this component
        * @type {string}
        */
      this.customId = data.custom_id;
    }

    if ("values" in data) {
      /**
        * Values that someone selected. Available only to select menus.
        * @type {string[]}
        */
      this.values = data.values;
    }
  }
}

module.exports = MessageComponentInteraction;
