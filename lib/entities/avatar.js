'use strict';

function Avatar(spec) {
  this.type = 'avatar';

  for (var prop in spec) {
    this[prop] = spec[prop];
  }

  this._x = this._x;
  this._y = this._y;
  this._z = this._z;
}

var proto = Avatar.prototype = require('./base')();

require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);

Object.assign(
  proto, {
    _immortal: true,
    _range: 20,
    spawn: function(client) {
      if (client) {
        return this._event('spawn', this);
      } else {
        return this.despawn();
      }
    },
    // XXX temp
    _x: 100,
    _y: 200,
    _z: 20,
    create: function(color) {
      return this._event('create', {
        _color: color
      });
    },
    uncreate: function() {
      return this._event('uncreate');
    }
  });

module.exports = Avatar;