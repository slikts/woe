'use strict';

function Grid(logger, config) {
  var self = Object.create(proto);

  self._logger = logger;
  self._config = config;
  self._nodeCache = {};

  return self;
}

var proto = Grid.prototype = Object.assign(Object.create(null), {
  init: function(ents) {
    this.generate();

    for (var key in ents) {
      this.update(key, ents[key]);
    }
  },
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
      newNode[key] = ent;
    }
  },
  query: function(ent, range, fn) {
    var x = this._coord(ent._x);
    var y = this._coord(ent._y);
    var z = this._coord(ent._z);

    var range = Math.floor(range / this._worldRatio);
    var node;
    var item;

    for (var ix = x - range, nx = x + range; ix <= nx; ix++) {
      for (var iy = y - range, ny = y + range; iy <= ny; iy++) {
        for (var iz = z - range, nz = z + range; iz <= nz; iz++) {
          node = this[ix][iy][iz];
          for (var key in node) {
            item = node[key];
            if (item !== ent) {
              fn(key, item);
            }
          }
        }
      }
    }
  },
  _setWorldSize: function(worldSize) {
    var gridSize = this._config.size;
    var ratio = this._worldRatio = worldSize / gridSize;

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