const { CommandTypes } = require("../utils/Constants");

class ApplicationCommandPlugin {
  constructor (client) {
    Object.defineProperty(this, "client", { value: client });

    this.name = "application";
  }

  setCommands (commands) {
    if (!Array.isArray(commands)) {
      throw new Error(`Commands must be an array. Received a ${typeof commands} instead.`);
    }

    return this.client.rest.api.applications(this.client.user.id)
      .commands.put({ data: commands });
  }

  setGuildCommands (commands, guildId) {
    if (!Array.isArray(commands)) {
      throw new Error(`Commands must be an array. Received a ${typeof commands} instead.`);
    }

    return this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.put({ data: commands });
  }

  async createCommand (command) {
    const error = this.#validateCommand(command);

    if (error) throw error;

    return await this.client.rest.api.applications(this.client.user.id)
      .commands.post({ data: command });
  }

  async createGuildCommand (command, guildId) {
    const error = this.#validateCommand(command);

    if (error) throw error;

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.post({ data: command });
  }

  async setCommandPermissions (permissions, guildId) {
    if (!Array.isArray(permissions)) {
      throw new Error(`Permissions must be an array. Received a ${typeof permissions} instead.`);
    }

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands.permissions({ data: permissions });
  }

  async editCommandPermissions (permissions, commandId, guildId) {
    if (!Array.isArray(permissions)) {
      throw new Error(`Permissions must be an array. Received a ${typeof permissions} instead.`);
    }

    return await this.client.rest.api.applications(this.client.user.id)
      .guilds(guildId).commands(commandId).permissions.put({ data: permissions });
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

      if (!/^[w-]{1,32}$/.test(command.name)) {
        return new Error(`The command name "${command.name}" does not match the expression "^[w-]{1,32}$", make sure your command name is between 1-32 and has no space.`);
      }
    }

    return false;
  }
}

module.exports = ApplicationCommandPlugin;
