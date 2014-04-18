'use strict';

var position = require('./position');

module.exports = function(obj) {
  position(obj);
  Object.assign(obj, {
    _speed: 1, // blocks per sec
    move: function(heading) {
      return this.event('move', {
        _heading: heading
      }, true);
    }
  });
};