require("dotenv").config();

const { Client } = require("./src/");

const client = new Client(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true }
});

client.on("messageCreate", async (message) => {
  if (message.content === "react") {
    const emojis = ["🕵", "😎", "😱", "🚀", "✨"];

    for (const emoji of emojis) message.addReaction(emoji);
  }

  if (message.content === "say") {
    const msg = await message.channel.send("Hello");

    setTimeout(() => msg.edit("Dudek gay"), 3000);
  }

  if (message.content === "tratelimit") {
    await message.channel.send("First");
    await message.channel.send("Second");
    await message.channel.send("Third");
    await message.channel.send("Fourth");
    await message.channel.send("Fifth");
    await message.channel.send("Six");
  }
});

client.on("ready", () => {
  write("Pronto!");
});

const write = (content) => process.stdout.write(`${content}\n`);

client.on("shardError", (error, shardID) => write(`Shard Error: ${error} ID: ${shardID}`));
client.on("warn", (warn) => write(`Aviso ${warn}`));
client.on("error", (error) => write(`Erro: ${error}`));
client.on("disconnect", (message) => write(`Desconectado: ${message}`));
client.on("debug", (message) => write(message));

client.start();
