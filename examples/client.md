```js
const { Client } = require('shiori');
// or
import { Client } from 'shiori';

const client = new Client('your token', { intents: ['guildMessages'] });

client.on('ready', () => console.log('Online!'));
  
client.on('messageCreate', (message) => {
  if (!message.guild) return;

  if (message.content === 'ping') {
    return message.channel.send('Pong!');
  }
});

client.start();
```
