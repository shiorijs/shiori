class ApplicationCommandPlugin {
  constructor (manager) {
    Object.defineProperty(this, "manager", { value: manager });

    this.name = "application";
    this._manager = this;
  }

  async setCommands (commands) {
    return true;
  }

  async setGuildCommands (commands, guildId) {
    return true;
  }

  async createCommand (command) {
    return true;
  }

  async createGuildCommand (command, guildId) {
    return true;
  }

  async setCommandPermissions (commandId, permissions) {
    return true;
  }
}

module.exports = ApplicationCommandPlugin;
