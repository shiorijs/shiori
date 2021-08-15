require("dotenv").config();

const { Client } = require("./src/")

const client = new Client(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true }
});

client.on("messageCreate", (data) => {
  if (data.content === "log") {
    const emoji = encodeURIComponent("🕵️‍♀️");

    client.rest.api
      .channels["857279585568686100"]
      .messages["876458102428422244"]
      .reactions[emoji]["@me"].put({ authenticate: true });
  }
})

client.start();
