const { CommandTypes } = require("../utils/Constants");

class ApplicationCommandPlugin {
  constructor (client) {
    Object.defineProperty(this, "client", { value: client });

    this.name = "application";
  }

  /**
    * Overwrites all global application commands
    * @param {ApplicationCommand[]} commands Array of application commands
    * @returns {Promise}
    */
  async setCommands (commands) {
    if (!Array.isArray(commands)) {
      throw new Error(`Commands must be an array. Received a ${typeof commands} instead.`);
    }

    return await this.client.rest.api.applications(this.client.user.id)
      .commands.put({ data: commands });
  }

  /**
    * Overwrites all guild application commands
    * @param {ApplicationCommand[]} commands Array of application commands
    * @param {string} guildId The guild id where these commands belongs to
    * @returns {Promise}
    */
  async setGuildCommands (commands, guildId) {
    if (!Array.isArray(commands)) {
      throw new Error(`Commands must be an array. Received a ${typeof commands} instead.`);
    }

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.put({ data: commands });
  }

  /**
    * Creates a global application command
    * @param {ApplicationCommand} command The application command structure to be created
    * @returns {Promise}
    */
  async createCommand (command) {
    const error = this.#validateCommand(command);

    if (error) throw error;

    return await this.client.rest.api.applications(this.client.user.id)
      .commands.post({ data: command });
  }

  /**
    * Creates a guild application command
    * @param {ApplicationCommand} command The command to be created
    * @param {string} guildId The guild id where the command will be created
    * @returns {Promise}
    */
  async createGuildCommand (command, guildId) {
    const error = this.#validateCommand(command);

    if (error) throw error;

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.post({ data: command });
  }

  /**
    * Overwrites all existing permissions for all application commands
    * @param {ApplicationCommandPermission[]} permissions The permissions structure array
    * @param {string} guildId The guild id where the permissions will be overwrited
    * @returns {Promise}
    */
  async setCommandPermissions (permissions, guildId) {
    if (!Array.isArray(permissions)) {
      throw new Error(`Permissions must be an array. Received a ${typeof permissions} instead.`);
    }

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.permissions({ data: permissions });
  }

  /**
    * Edits a specific application command permission
    * @param {ApplicationCommandPermission[]} permissions The permissions structure array
    * @param {string} commandId The command id where the permissions will take place
    * @param {string} guildId The guild id where the permissions will take place
    * @returns {Promise}
    */
  async editCommandPermissions (permissions, commandId, guildId) {
    if (!Array.isArray(permissions)) {
      throw new Error(`Permissions must be an array. Received a ${typeof permissions} instead.`);
    }

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands(commandId).permissions.put({ data: permissions });
  }

  /**
    * Deletes a global application command
    * @param {string} commandId The command id to be deleted
    * @returns {Promise}
    */
  async deleteCommand (commandId) {
    return await this.client.rest.api.applications(this.client.user.id)
      .commands(commandId).delete();
  }

  /**
    * Deletes a guild application command
    * @param {string} commandId The command id to be deleted
    * @returns {Promise}
    */
  async deleteGuildCommand (commandId, guildId) {
    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands(commandId).delete();
  }

  /**
    * Returns all global application commands
    * @returns {Promise<ApplicationCommand[]>}
    */
  async getCommands () {
    return await this.client.rest.api.applications(this.client.user.id)
      .commands.get();
  }

  /**
    * Returns all applications commands from a guild
    * @param {string} guildId The guild id to fetch the commands
    * @returns {Promise<ApplicationCommand[]>}
    */
  async getGuildCommands (guildId) {
    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.get();
  }

  /**
    * Returns informations about a global application command
    * @param {string} commandId The command id
    * @returns {Promise<ApplicationCommand>}
    */
  async getCommand (commandId) {
    return await this.client.rest.api.applications(this.client.user.id)
      .commands(commandId).get();
  }

  /**
    * Returns informations about a guild application command
    * @param {string} commandId The command id
    * @param {string} guildId The guild id where this command belongs
    * @returns {Promise<ApplicationCommand>}
    */
  async getGuildCommand (commandId, guildId) {
    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands(commandId).get();
  }

  /**
    * Edits a global application command
    * @param {ApplicationCommand} command The new application command structure
    * @param {string} commandId The command id to be edited
    * @returns {Promise}
    */
  async editCommand (command, commandId) {
    const error = this.#validateCommand(command);

    if (error) throw error;

    return await this.client.rest.api.applications(this.client.user.id)
      .commands(commandId).patch({ data: command });
  }

  /**
    * Edits a guild application command
    * @param {ApplicationCommand} command The new application command structure
    * @param {string} commandId The command id to be edited
    * @param {string} guildId The guild id where this command belongs
    * @returns {Promise<ApplicationCommand>}
    */
  async editGuildCommand (command, commandId, guildId) {
    const error = this.#validateCommand(command);

    if (error) throw error;

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands(commandId).patch({ data: command });
  }

  #validateCommand (command) {
    if (command.type == undefined || !("type" in command)) command.type = 1;

    if (!command.name) {
      return new Error("\"name\" is a required field and is not present on command.");
    }

    if (command.description == undefined && command.type === CommandTypes.CHAT_INPUT) {
      return new Error("\"description\" is a required field on chat input commands and is not present on this command.");
    }

    if (command.type === CommandTypes.CHAT_INPUT) {
      command.name = command.name.toLowerCase();

      if (!/^[\w-]{1,32}$/.test(command.name)) {
        return new Error(`The command name "${command.name}" does not match the expression "^[w-]{1,32}$", make sure your command name is between 1-32 and has no space.`);
      }
    }

    return false;
  }
}

module.exports = ApplicationCommandPlugin;
