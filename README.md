# hitomi
A lightweight discord library made for NodeJS.

# Customizable cache

```js
const { Client } = require("hitomi.js");

// Keep a note that all cache options aren't required
const client = new Client("MY_SECRET_TOKEN", {
  cache: {
    users: {
      // No limit on users
      limit: Infinity,
      // If the username starts with A it will be added to the collection, otherwise it wont
      toAdd: (userID, user) => user.username.startsWith("A"),
      // If the user isn't a owner then remove it when sweeping!
      toRemove: (user) => !process.env.OWNERS.includes(user.id)),
      // Choose how much users to clear when sweeping
      sweep: 50,
      // Interval in MS that the sweep will occur
      sweepTimeout: 60000
    }
  }
});
```
