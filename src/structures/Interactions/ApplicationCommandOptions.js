const { CommandOptionTypes} = require("../../utils/Constants");

class ApplicationCommandOptions {
  #client;
  #options;

  /**
   * @param {Client} client The instantiating client
   * @param {InteractionCommandOptions[]} options The application command options
   */
  constructor (client, options = []) {
    this.#client = client;
    /**
     * The subcommand name, if any.
     * @returns {?string} Name of the subcommand
     */
    this.subcommand = null;

    /**
     * The subcommand group name, if any.
     * @returns {?string} Name of the subcommand group
     */
    this.subcommandGroup = null;

    this.#options = options;

    if (
      this.#options[0]?.type === CommandOptionTypes.SUB_COMMAND ||
      this.#options[0]?.type === CommandOptionTypes.SUB_COMMAND_GROUP
    ) {
      const name = this.#options[0].type === CommandOptionTypes.SUB_COMMAND
        ? "subcommand"
        : "subcommandGroup";

      this.#options = this.#options.options ?? [];
      this[name] = this.#options[0].name;
    }
  }

  #resolveOption (optionName, type) {
    const option = this.#options.find(
      c => c.name === optionName && c.type === type
    );

    if (option == undefined) return null;

    return option.value;
  }

  string (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.STRING);
  }

  integer (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.INTEGER);
  }

  boolean (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.BOOLEAN);
  }

  user (optionName, resolve = false) {
    const userId = this.#resolveOption(optionName, CommandOptionTypes.USER);

    if (!userId) return null;
    if (!resolve) return userId;

    return this.#client.users.get(userId) ?? userId;
  }

  channel (optionName, resolve = false) {
    const channelId = this.#resolveOption(optionName, CommandOptionTypes.CHANNEL);

    if (!channelId) return null;
    if (!resolve) return channelId;

    return this.#client.utils.getChannel(channelId);
  }

  role (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.ROLE);
  }

  number (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.NUMBER);
  }
}

module.exports = ApplicationCommandOptions;
