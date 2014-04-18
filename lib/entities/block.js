'use strict';

var base = require('./base');
var position = require('./behaviors/position');
var hp = require('./behaviors/position');
var proto;

function Block(config) {
  this.init(config);
}

proto = Block.prototype = base();

position(proto);
hp(proto);

Object.assign(proto, {
  _type: 'block',
  init: function(config) {
    Object.assign(this, config || {});

    if (!this._id) {
      this._id = this._x + '_' + this._y + '_' + this._z;
    }
  }
});

module.exports = Block;