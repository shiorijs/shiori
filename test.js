require("dotenv").config();

const { Client } = require("./src/")

const client = new Client(process.env.DISCORD_TOKEN, {
  intents: 13827
});

client.start();
