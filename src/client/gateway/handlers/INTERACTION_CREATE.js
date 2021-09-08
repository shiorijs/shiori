const Interaction = require("../../../structures/Interactions/Interaction");

module.exports = (client, { d: data }) => {
  const interaction = Interaction.transform(data, client);

  /**
    * Fired when a interaction is created.
    * @event Client#interactionCreate
    * @prop {Interaction} interactionCreate The received interaction.
    */
  client.emit("interactionCreate", interaction);
};
