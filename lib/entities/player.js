'use strict';

function Player(spec) {
  this.type = 'player';

  for (var prop in spec) {
    this[prop] = spec[prop];
  }
}

var proto = Player.prototype = Object.create(null);

Object.assign(
  proto, {
    _spawned: true,
    spawn: function() {
      return this._event('spawn', {
        _spawned: true
      });
    },
    despawn: function() {
      return this._event('mutate', {
        _spawned: false
      });
    }
  });

require('./behaviors/base')(proto);
require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);

module.exports = Player;