In order to create application commands you must use the plugin `ApplicationCommandPlugin`. You can learn more about plugins in it's own section.

```js
const { Client, ApplicationCommandPlugin } = require('shiori');

const client = new Client('your token', {
  intents: 13827,
  plugins: [ApplicationCommandPlugin]
});

client.on("ready", () => console.log("Listening for interactions!"));

client.on("messageCreate", async (message) => {
  if (message.author.id !== "YOUR_ID") return;

  if (mesage.content === "!deploy") {
    const command = {
      name: "quality",
      description: "Show the quality of someone!",
      options: [
        {
          type: 3,
          name: "user",
          description: "The user to show the quality of",
          required: true,
          choices: [
            {
              name: "Alice",
              value: "Swimmer"
            },
            {
              name: "Daniel",
              value: "Inteligent"
            }
          ]
        }
      ]
    }

    client.application.createCommand(command)
      .then(() => message.react("✅"))
      .catch(() => message.react("❌"));
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isSlashCommand()) return;

  if (interaction.command.name === "quality") {
    const option = interaction.options.string("user");

    switch (option) {
      case "daniel": {
        return await interaction.reply("Daniel is amazing!");
      }
      case "alice": {
        return await interaction.reply("Alice is incredible!");
      }
    }
  }
})

client.start();
```
