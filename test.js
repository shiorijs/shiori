require("dotenv").config();

const Shiori = require("./src/");

const client = Shiori(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true },
<<<<<<< HEAD
=======
  utils: true,
>>>>>>> feat() cache manager
  cache: {
    users: { limit: 20 }
  }
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
    // eslint-disable-next-line no-console
    return console.log(client.utils.getChannel("800889654198009899"));
  }
});

client.on("ready", () => write("Pronto!"));
client.on("shardError", (error, shardID) => write(`Shard Error: ${error} ID: ${shardID}`));
client.on("warn", (warn) => write(`Aviso ${warn}`));
client.on("error", (error) => write(`Erro: ${error}`));
client.on("disconnect", (message) => write(`Desconectado: ${message}`));
client.on("debug", (message) => write(message));

client.start();
