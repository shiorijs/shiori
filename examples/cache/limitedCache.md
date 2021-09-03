```js
const { Client } = require('shiori');
// or
import { Client } from 'shiori';

// Keep a note that all cache options aren't required
const client = new Client('your token', {
  cache: {
    users: {
      // There will be added as many as possible users
      limit: Infinity,
      // If the username starts with A it will be added to the collection, otherwise it wont
      toAdd: (user, userID) => user.username.startsWith("A"),
      // If the user isn't a owner then remove it when sweeping!
      toRemove: (user) => !process.env.OWNERS.includes(user.id)),
      // Choose how much users to clear when sweeping
      sweep: 50,
      // Interval in MS that the sweep will occur
      sweepTimeout: 60000
    }
  }
});

client.start();
```
