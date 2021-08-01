'use strict';

const { WSEvents } = require('../../../utils/Constants');

const handlers = {};

for (const name of WSEvents) {
  try {
    handlers[name] = require(`./${name}.js`);
  } catch (err) {
    continue
  }
}

module.exports = handlers;
