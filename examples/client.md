# Step #1
### Import the client and connect to Discord.
 
```js
/* Import the Client */
const { Client } = require('shiori');
/* Or */
import { Client } from 'shiori';
 
/* Create the Client */
const client = new Client('your token', { intents: ['GUILD_MESSAGES']);
 
/* Listen the ready event */
client.on('ready', () => console.log('Online!'));
```
 
# Step #2
### Then, make the bot listen to the messageCreate event and send a message
```js
/* Import the Client */
const { Client } = require('shiori');
/* Or */
import { Client } from 'shiori';
 
/* Create the Client */
const client = new Client('your token', { intents: ['GUILD_MESSAGES']);
 
/* Listen the ready event */
client.on('ready', () => console.log('Online!'));
 
client.on('messageCreate', async (message) => {
 
  /* Checks if the message has the 'guild' property */
  if (!message.guild) return;
 
  /* Checks if the message content is 'sendMessage' */
  if (message.content === 'sendMessage') {
    /* Return a message with */
    return message.channel.send('This is a simple message!');
  }
});
```
 
# Step #3 (Optional)
### Now you have the freedom to choose whether to send a reaction along with the message or not, it is optional
```js
/* Import the Client */
const { Client } = require('shiori');
/* Or */
import { Client } from 'shiori';
 
/* Create the Client */
const client = new Client('your token', { intents: ['GUILD_MESSAGES']);
 
/* Listen the ready event */
client.on('ready', () => console.log('Online!'));
 
client.on('messageCreate', async (message) => {
 
  /* Checks if the message has the 'guild' property */
  if (!message.guild) return;
 
  /* Checks if the message content is 'sendMessage' */
  if (message.content === 'sendMessage') {
    /* Return a message with the reaction */
    return message.channel.send('This is a message with a reaction!').then((msg) => msg.addReaction('😀'));
  }
});
```
