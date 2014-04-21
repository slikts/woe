'use strict';


module.exports = function(proto) {
  require('./position')(proto);

  Object.assign(proto, {
    _speed: 11, // blocks per sec
    move: function(heading) {
      return this._event('move', {
        _heading: heading
      }, true);
    }
  });
};