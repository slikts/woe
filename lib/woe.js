'use strict';

require('es5-ext/object/assign/implement');

var Ticker = require('delta-ticker');
var config = require('./config');
var logger = require('bunyan').createLogger({
  level: config.logger.level,
  name: config.world.name
});
var state = require('./state');
var events = require('./events')(state);
var queue = require('./queue')(logger, Ticker, events)(config.queue);
var world = require('./world')(logger, queue)(config.world);

module.exports = world;