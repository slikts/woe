'use strict';

function Player(spec) {
  this.type = 'player';

  for (var prop in spec) {
    this[prop] = spec[prop];
  }
}

var proto = Player.prototype = require('./base')();

require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);
require('./behaviors/context')(proto);

Object.assign(
  proto, {
    limbo: true,
    despawn: function() {
      return this._event('despawn');
    }
  });

module.exports = Player;