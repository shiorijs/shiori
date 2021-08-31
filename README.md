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

  // Don't create application commands on the ready event.
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

# Faq

## Which library should I use? Discord.js, Eris or Shiori?

It's up to what you feel more comfortable with. There are different use cases and only you may decide when using these libraries.

## When should I use Shiori?

Shiori may help you a lot if you're creating a bot that the majority of code is not discord api related. If you're creating a economy bot, for example, the majority of the code will be pure javascript, and the discord api will only be used to create messages, etc.. Don't get us wrong, you can perfectly create a multipurpose bot in Shiori, but Shiori shines the most at bots that only wants the **basic**.

## I decided to switch to Shiori, how I do it?

Shiori syntax is relatively similar to Discord.JS, while Shiori purpose is closer to Eris. That means that you won't have that much of problem when switching from one of these two libraries.

## Can I create my own plugin?

Yes! It's definitely one of the best options if you want to create a client feature. Choosing to do it with a Plugin will be safe, fast and easy.

# Resources

- [example bot](https://github.com/shiorijs/examplebot) - a simple bot written with Shiori;
