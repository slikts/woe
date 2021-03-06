'use strict';

function User(spec) {
  this.type = 'user';

  for (var prop in spec) {
    this[prop] = spec[prop];
  }
}

var proto = User.prototype = require('./base')();

Object.assign(
  proto, {
    _immortal: true,
    spawn: function() {
      return this._event('despawn');
    }
  });

module.exports = User;