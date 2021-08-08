const Collection = require("../utils/Collection");
const Member = require("./Member");

module.exports = class Guild {
  constructor (data) {
    this.data = data;

    this.members = new Collection(Member);
  }
}
