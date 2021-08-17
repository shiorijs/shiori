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

client.on("shardError", (error) => `Shard Error: ${console.error(error)}`);
client.on("warn", (warn) => `Aviso ${console.warn(warn)}`);
client.on("error", (error) => `Erro: ${console.error(error)}`);
client.on("disconnect", (message) => `Desconectado: ${message}`);

client.start();
