require("dotenv").config();

const { Client } = require("./src/")

const client = new Client(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true }
});

client.on("messageCreate", (data) => {
  if (data.content === "log") {
    const emojis = [encodeURIComponent("🕵"), encodeURIComponent("😎")];

    for (const emoji of emojis) {
      client.rest.api
        .channels["857279585568686100"]
        .messages[data.id]
        .reactions[emoji]["@me"].put({ authenticate: true }).then(console.log);
    }
  }
})

client.on("warn", (warn) => console.warn(warn))

client.start();
