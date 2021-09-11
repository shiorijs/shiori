const EventEmitter = require("events");

module.exports = class ShioriEvents extends EventEmitter {
  constructor () {
    super();
  }

  async waitFor (event, filter) {
    await new Promise(resolve => {
      const eventCheck = (...args) => {
        if (filter(...args)) resolve(args);
      };

      this.on(event, eventCheck);
    });
  }
};
