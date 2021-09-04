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

  /**
   * Returns an option with type string
   * @param {string} optionName Option to get the value of
   * @returns {string}
   */
  string (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.STRING);
  }

  /**
   * Returns an option with type integer
   * @param {string} optionName Option to get the value of
   * @returns {number}
   */
  integer (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.INTEGER);
  }

  /**
   * Returns an option with type boolean
   * @param {string} optionName Option to get the value of
   * @returns {boolean}
   */
  boolean (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.BOOLEAN);
  }

  /**
   * Returns an option with type user
   * @param {string} optionName Option to get the value of
   * @param {boolean} resolve Whether to return the resolved user
   * @returns {User | string}
   */
  user (optionName, resolve = false) {
    const userId = this.#resolveOption(optionName, CommandOptionTypes.USER);

    if (!userId) return null;
    if (!resolve) return userId;

    return this.#client.users.get(userId) ?? userId;
  }

  /**
   * Returns an option with type channel
   * @param {string} optionName Option to get the value of
   * @param {boolean} resolve Whether to return the resolved channel
   * @returns {Channel | string}
   */
  channel (optionName, resolve = false) {
    const channelId = this.#resolveOption(optionName, CommandOptionTypes.CHANNEL);

    if (!channelId) return null;
    if (!resolve) return channelId;

    return this.#client.utils.getChannel(channelId);
  }

  /**
   * Returns an option with type role
   * @param {string} optionName Option to get the value of
   * @returns {string}
   */
  role (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.ROLE);
  }

  /**
   * Returns an option with type number
   * @param {string} optionName Option to get the value of
   * @returns {string}
   */
  number (optionName) {
    return this.#resolveOption(optionName, CommandOptionTypes.NUMBER);
  }
}

module.exports = ApplicationCommandOptions;
