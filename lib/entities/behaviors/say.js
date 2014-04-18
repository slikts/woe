'use strict';

module.exports = function(obj) {
  Object.assign(obj, {
    say: function(text) {
      return this.event('say', text);
    }
  });
};