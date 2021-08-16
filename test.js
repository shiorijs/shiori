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

    console.log(client.rest.ratelimits);
  }

  if (message.content == "dmessage") {
    // GET guilds/{guild.id}/bans
    client.rest.api
      .guilds[message.guild_id]
      .bans.get().then(console.log)
  }
});

client.on("warn", (warn) => console.log(warn));
client.on("error", (error) => console.error(error));

client.start();
