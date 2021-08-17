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

  if (message.content === "reconnect") {
    console.log(client.shards.get(0));
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

client.on("shardError", (error) => console.error(error));
client.on("warn", (warn) => console.log(warn));
client.on("error", (error) => console.error(error));

client.start();
