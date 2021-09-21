const EventEmitter = require("events");

module.exports = class ShioriEvents extends EventEmitter {
  constructor () {
    super();
  }

  async waitFor (event, filter) {
    await new Promise(resolve => {
      const eventFilter = (...args) => {
        if (filter(...args)) resolve(args);
      };

      this.on(event, eventFilter);
    });
  }
};
