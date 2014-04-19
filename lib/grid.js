'use strict';

function Grid(logger, config) {
  var self = Object.create(proto);

  self._logger = logger;
  self._config = config;

  return self;
}

var proto = Grid.prototype = Object.assign(Object.create(null), {
  generate: function() {
    var size = this._config.size;

    function node() {
      return Object.create(null);
    }

    var before = Date.now();

    for (var x = 0; x < size; x++) {
      this[x] = node();
      for (var y = 0; y < size; y++) {
        this[x][y] = node();
        for (var z = 0; z < size; z++) {
          this[x][y][z] = node();
        }
      }
    }

    this._logger.info({
      name: 'grid',
      size: Math.pow(size, 3).toExponential(),
      dt: Date.now() - before + 'ms'
    }, 'generated');
  }
});

module.exports = function(logger) {
  return Grid.bind(null, logger);
};