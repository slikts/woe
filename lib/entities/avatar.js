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

Object.assign(
  proto, {
    _immortal: true,
    _range: 10,
    spawn: function(client) {
      if (client) {
        return this._event('spawn', this);
      } else {
        return this.despawn();
      }
    }
  });

module.exports = Avatar;