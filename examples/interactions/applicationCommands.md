In order to use interactions you must use the plugin `@shiorijs/interactions`. You can learn more about plugins in it's own section.

```js
const { Client } = require('shiori');
const { InteractionPlugin } = require('@shiorijs/interactions');

const client = new Client('your token', {
  intents: 13827,
  plugins: [InteractionPlugin]
});

client.on("ready", () => console.log("Listening for interactions!"));

client.on("messageCreate", async (message) => {
  if (message.author.id !== "YOUR_ID") return;

  if (mesage.content === "!deploy") {
    const command = {
      name: "ping",
      description: "Pong!"
    }

    client.application.createCommand(command)
      .then(() => message.addReaction("✅"))
      .catch(() => message.addRaction("❌"));
  }
});

client.on("interactionCreate", (interaction) => {
  if (interaction.type !== 1) return;

  switch (interaction.command.name) {
    case "ping": {
      return interaction.reply({ content: "Pong!" });
    }
  }
})

client.start();
```
