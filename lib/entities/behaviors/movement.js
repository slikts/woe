'use strict';


module.exports = function(proto) {
  require('./position')(proto);

  Object.assign(proto, {
    _speed: 7, // blocks per sec
    move: function(heading) {
      return this._event('move', {
        _heading: heading
      }, true);
    }
  });
};