require("dotenv").config();

const { Client } = require("./src/");

const client = new Client(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true },
  utils: true
});

const write = (content) => process.stdout.write(`${content}\n`);

client.on("messageCreate", async (message) => {
  if (message.content === "react") {
    const emojis = ["🕵", "😎", "😱", "🚀", "✨"];

    for (const emoji of emojis) message.addReaction(emoji);

    return;
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
    return message.channel.send(client.utils?.getChannel(message.channel.id));
  }
});

client.on("ready", () => write("Pronto!"));
client.on("shardError", (error, shardID) => write(`Shard Error: ${error} ID: ${shardID}`));
client.on("warn", (warn) => write(`Aviso ${warn}`));
client.on("error", (error) => write(`Erro: ${error}`));
client.on("disconnect", (message) => write(`Desconectado: ${message}`));
client.on("debug", (message) => write(message));

client.start();
