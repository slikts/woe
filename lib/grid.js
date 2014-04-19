'use strict';

function Grid(logger, config) {
  var self = Object.create(proto);

  self._logger = logger;
  self._config = config;
  self._nodeCache = {};

  return self;
}

var proto = Grid.prototype = Object.assign(Object.create(null), {
  generate: function() {
    var size = this._config.size;

    function node() {
      return {};
    }

    var before = Date.now();
    var bytes = process.memoryUsage().heapUsed;

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
      dt: Date.now() - before + 'ms',
      memory: '+' + Math.round((process.memoryUsage().heapUsed - bytes) / 1024 / 1024) + 'M'
    }, 'generated');
  },
  forget: function(key) {
    delete this._nodeCache[key][key];
    delete this._nodeCache[key];
  },
  update: function(key, ent) {
    var nodeCache = this._nodeCache;
    var currentNode = nodeCache[key];
    var newNode = this._findNode(ent);

    if (currentNode !== newNode) {
      if (currentNode) {
        delete currentNode[key];
      }
      nodeCache[key] = newNode;
    }
  },
  query: function(ent, radius, fn) {
    // XXX
  },
  _setWorldSize: function(worldSize) {
    var gridSize = this._config.size;
    var ratio = worldSize / gridSize;

    this._worldSize = worldSize;

    this._coord = function(x) {
      return Math.floor(x / ratio);
    };
  },
  _findNode: function(ent) {
    return this[this._coord(ent._x)][this._coord(ent._y)][this._coord(ent._z)];
  }
});

module.exports = function(logger) {
  return Grid.bind(null, logger);
};