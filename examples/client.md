```js
const { Client } = require('shiori');
// or
import { Client } from 'shiori';

const client = new Client('your token', { intents: ['GUILD_MESSAGES'] });

client.on('ready', () => console.log('Online!'));
  
client.on('messageCreate', (message) => {
  if (!message.guild || message.author.bot) return;

  if (message.content === 'ping') {
    return message.channel.send('Pong!');
  }
});

client.start();
```
