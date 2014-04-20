'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    say: function(text) {
      return this._event('say', {
        message: text,
        time: Date.now()
      });
    }
  });
};