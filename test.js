require("dotenv").config();

const Shiori = require("./src/");

const client = Shiori(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true },
  plugins: [Shiori.ApplicationCommandPlugin],
  cache: {
    users: {
      limit: Infinity,
      sweep: 10,
      sweepTimeout: 10000,
      toAdd: (_, userID) => {
        if (![
          "664806442406248448",
          "532294395655880705",
          "515903666360942594",
          "478031386796752896",
          "817505090977923093"
        ].includes(userID)) return false;
        else return true;
      },
      toRemove: (_, userID) => {
        if (["664806442406248448", "515903666360942594"].includes(userID)) return true;
        else return false;
      }
    }
  }
});

const write = (content) => process.stdout.write(`${content}\n`);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isContextMenu()) {
    await interaction.reply(`Você escolheu ${interaction.targetId}`);
  }

  if (interaction.isSlashCommand()) {
    if (interaction.command.name === "quality") {
      const option = interaction.options.string("user");

      switch (option) {
        case "daniel": {
          return await interaction.reply("Daniel é burro");
        }
        case "alice": {
          return await interaction.reply("Alice é gostosa");
        }
      }
    }

    if (interaction.command.name === "permissions") {
      if (interaction.options.subcommandGroup === "set") {
        if (interaction.options.subcommand === "user") {
          return interaction.reply(`Ui lucas-kun me come. ${interaction.options.user("user")}`);
        }
      }
    }
  }

  if (interaction.isSelectMenu()) {
    await interaction.reply(`Você escolheu ${interaction.values[0]}... Tá totalmente certo`);
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "avatar") {
    return message.channel.send(client.utils.image(message.author).avatar());
  }

  if (message.content === "react") {
    const emojis = ["🕵", "😎", "😱", "🚀", "✨"];

    for (const emoji of emojis) message.addReaction(emoji);

    return;
  }

  if (message.content === "context-menu") {
    client.application.setGuildCommands([{
      name: "Profile",
      type: 3
    }], "800130595794583582");
  }

  if (message.content === "select") {
    const button = {
      placeholder: "Quem é mais gay?",
      custom_id: "select",
      type: 3,
      max_values: 2,
      options: [{
        label: "Lucas Gay",
        value: "lucas",
        description: "Lucas é bem gay ne"
      }, {
        label: "Deivin Gay",
        value: "deivin",
        description: "Deivinni é bem gay ne"
      }]
    };
    const components = [{ type: 1, components: [button] }];

    message.channel.send({ content: "Clique!", components });
  }

  if (message.content === "buttons") {
    const button = { label: "Clique aqui", custom_id: "button", style: 1, type: 2 };
    const components = [{ type: 1, components: [button] }];

    message.channel.send({ content: "Olá!", components });
  }

  if (message.content === "say") {
    const msg = await message.channel.send("Hello");

    return setTimeout(() => msg.edit("Dudek gay"), 3000);
  }

  if (message.content === "tratelimit") {
    await message.channel.send("First");
    await message.channel.send("Second");
    await message.channel.send("Third");
    await message.channel.send("Fourth");
    await message.channel.send("Fifth");
    return message.channel.send("Six");
  }

  if (message.content === "utils") {
    // eslint-disable-next-line no-console
    return console.log(client.utils.getChannel("800889654198009899"));
  }

  if (message.content === "slash") {
    const commands = [{
      name: "quality",
      description: "Show the quality of someone!",
      options: [
        {
          type: 3,
          name: "user",
          description: "The user to show the quality of",
          required: true,
          choices: [
            {
              name: "Alice",
              value: "alice"
            },
            {
              name: "Daniel",
              value: "daniel"
            }
          ]
        }
      ]
    }, {
      "name": "permissions",
      "description": "Permission Manager",
      "options": [
        {
          "type": 2,
          "name": "set",
          "description": "Set the permissions for something",
          "options": [
            {
              "type": 1,
              "name": "user",
              "description": "Set the permissions for an user",
              "options": [
                {
                  "type": 6,
                  "name": "user",
                  "description": "The user to set the permission to",
                  "required": true
                }
              ]
            },
            {
              "type": 1,
              "name": "channel",
              "description": "Set the permissions for a channel",
              "options": [
                {
                  "type": 7,
                  "name": "channel",
                  "description": "The channel to set the permission to",
                  "required": true
                }
              ]
            }
          ]
        }
      ]
    }];

    client.application.setGuildCommands(commands, "800130595794583582")
      .then(() => message.react("✅"))
      .catch(() => {
        message.react("❌");
      });
  }
});

client.on("ready", () => write("Ready!"));
client.on("shardError", (error, shardID) => write(`Shard Error: ${error} ID: ${shardID}`));
client.on("warn", (warn) => write(`Aviso ${warn}`));
client.on("error", (error) => write(`Erro: ${error}`));
client.on("disconnect", (message) => write(`Desconectado: ${message}`));
client.on("debug", (message) => write(message));

process
  .once("unhandledRejection", (error) => write(error.stack))
  .once("uncaughtException", (error) => write(error.stack));

client.start();
