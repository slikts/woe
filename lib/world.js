'use strict';

var proto = {
  init: function(config) {
    this._config = config;
  },
  run: function() {
    this._logger.info({
      config: this._config
    }, 'running world');

    this._started = Date.now();

    this._queue.start();
  }
};

function World(logger, queue, config) {
  var world = Object.create(proto);

  world._logger = logger;
  world._queue = queue;
  world.init(config);

  return world;
}

module.exports = function(logger, queue) {
  return World.bind(null, logger, queue);
};