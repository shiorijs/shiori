const Interaction = require("../../../structures/Interaction");

module.exports = (client, { d: data }) => {
  const interaction = new Interaction(data, client);

  /**
    * Fired when a interaction is created.
    * @event Client#interactionCreate
    * @prop {Interaction} interactionCreate The received interaction.
    */
  client.emit("interactionCreate", interaction);
};
