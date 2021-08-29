# Shiori
A customizable and fast NodeJS library made for interacting with the discord api.

# Setup

```
yarn add shiori
npm install shiori
```

# Example

```js
const { Client, Intents } = require("shiori");

const bot = new Client("MY_COOL_TOKEN", { intents: [Intents.GUILD_MESSAGES] });

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    return message.channel.send("Pong!");
  }
});

client.start();
```

# Plugins

Shiori is a customizable library, meaning that you can select everything that you want on your bot.

```js
const { Client } = require("shiori");
const { InteractionPlugin } = require("@shiori/interactions");

const client = new Client("MY_COOL_TOKEN", { intents: 0, plugins: [InteractionPlugin] });

client.on("ready", () => {
  console.log("Listening for interactions!");

  const commands = [
    { name: "ping", description: "Pong!" }
  ];

  // That's just a example, don't create slash commands on the ready event.
  return client.application.commands.set(commands);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.command) return;

  if (interaction.command.name === "ping") {
    return interaction.reply("Pong!");
  }
});

client.start();
```