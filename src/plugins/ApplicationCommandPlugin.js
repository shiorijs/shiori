class ApplicationCommandPlugin {
  constructor (manager) {
    Object.defineProperty(this, "manager", { value: manager });

    this.name = "application";
    this._manager = this;
  }

  setCommands (commands) {
    return (commands);
  }

  setGuildCommands (commands, guildId) {
    return (commands, guildId);
  }

  createCommand (command) {
    return (command);
  }

  createGuildCommand (command, guildId) {
    return (command, guildId);
  }

  setCommandPermissions (commandId, permissions) {
    return (commandId, permissions);
  }
}

module.exports = ApplicationCommandPlugin;
