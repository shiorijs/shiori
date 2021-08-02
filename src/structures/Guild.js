const Collection = require("../utils/Collection");

module.exports = class Guild {
  constructor (data) {
    this.data = data;

    this.members = new Collection();
  }
}
