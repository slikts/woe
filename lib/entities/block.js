'use strict';

function Block(spec) {
  this.type = 'block';

  for (var prop in spec) {
    this[prop] = spec[prop];
  }

  if (!this._id) {
    this._id = this._x + '_' + this._y + '_' + this._z;
  }
}

var proto = Block.prototype = require('./base')();

require('./behaviors/position')(proto);
require('./behaviors/hp')(proto);

delete proto.init;

module.exports = Block;