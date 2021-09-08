require("dotenv").config();

const Shiori = require("./src/");

const client = Shiori(process.env.DISCORD_TOKEN, {
  intents: 13827,
  rest: { fetchAllUsers: true },
  plugins: [Shiori.ApplicationCommandPlugin],
  cache: {
    users: {
      limit: Infinity,
      sweep: 10,
      sweepTimeout: 10000,
      toAdd: (_, userID) => {
        if (![
          "664806442406248448",
          "532294395655880705",
          "515903666360942594",
          "478031386796752896",
          "817505090977923093"
        ].includes(userID)) return false;
        else return true;
      },
      toRemove: (_, userID) => {
        if (["664806442406248448", "515903666360942594"].includes(userID)) return true;
        else return false;
      }
    }
  }
});

const write = (content) => process.stdout.write(`${content}\n`);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isContextMenu()) {
    await interaction.reply(`Conteúdo ${interaction.resolveTarget("message")[0].content}`);
  }

  if (interaction.isSlashCommand()) {
    await interaction.reply({ content: "AAAAAAAAAAAAAAAAAAA" });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "tratelimit") {
    await message.channel.send("First");
    await message.channel.send("Second");
    await message.channel.send("Third");
    await message.channel.send("Fourth");
    await message.channel.send("Fifth");
    return message.channel.send("Six");
  }
});

client.on("ready", () => write("Ready!"));
client.on("shardError", (error, shardID) => write(`Shard Error: ${error} ID: ${shardID}`));
client.on("warn", (warn) => write(`Aviso ${warn}`));
client.on("error", (error) => write(`Erro: ${error}`));
client.on("disconnect", (message) => write(`Desconectado: ${message}`));
client.on("debug", (message) => write(message));

process
  .once("unhandledRejection", (error) => write(error.stack))
  .once("uncaughtException", (error) => write(error.stack));

client.start();
