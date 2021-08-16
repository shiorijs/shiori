require("dotenv").config();

const { Client } = require("./src/");

const client = new Client(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true }
});

client.on("messageCreate", async (message) => {
  if (message.content === "react") {
    const emojis = ["🕵", "😎", "😱"];

    for (const emoji of emojis) message.addReaction(emoji);
  }

  if (message.content === "say") {
    const msg = await message.channel.send("Hello");

    setTimeout(() => msg.edit("Dudek gay"), 3000);
  }
});

client.on("warn", (warn) => console.log(warn));
client.on("error", (error) => console.error(error));

client.start();
