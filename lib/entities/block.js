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

var proto = Block.prototype = Object.create(null);

require('./behaviors/base')(proto);
require('./behaviors/position')(proto);
require('./behaviors/hp')(proto);

delete proto.init;

module.exports = Block;