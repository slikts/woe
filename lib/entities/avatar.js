'use strict';

function Avatar(spec) {
  this.type = 'avatar';

  for (var prop in spec) {
    this[prop] = spec[prop];
  }
}

var proto = Avatar.prototype = require('./base')();

require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);
require('./behaviors/context')(proto);

Object.assign(
  proto, {
    _immortal: true,
    spawn: function(client) {
      return this._event(client ? 'spawn' : 'despawn');
    }
  });

module.exports = Avatar;