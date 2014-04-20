'use strict';

require('es5-ext/object/assign/implement');

var Ticker = require('delta-ticker');
var config = require('./config');

var logger = require('bunyan').createLogger({
  level: config.logger.level,
  name: config.world.name
});

var entities = require('./entities');
var grid = require('./grid')(logger)(config.grid);
var state = require('./state')(entities, grid, logger)(config.state);
var events = require('./events')(state);
var queue = require('./queue')(logger, Ticker, events)(config.queue);
var world = require('./world')(logger, queue, state)(config.world);

// XXX
state._queue = queue;

module.exports = world;