# Shiori
A customizable and fast NodeJS library made for interacting with the discord api.

- Shiori provides plugins, which allows you to choose which features to include in your bot;
- Customize your cache. Limit your collections and choose which item gets added or removed;

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

  const commands = [{ name: "ping", description: "Pong!" }];

  // Don't create appliaction commands on the ready event.
  return client.application.commands.set(commands);
});

// If you want to create interactions by your own use the "INTERACTION_CREATE" event.
client.on("interactionCreate", (interaction) => {
  if (!interaction.command) return;

  if (interaction.command.name === "ping") {
    return interaction.reply("Pong!");
  }
});

client.start();
```