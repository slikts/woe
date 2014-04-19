'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _range: 5,
    _filter: function(spec) {
      if (spec.subject === this) {
        return false;
      }

      // XXX
      return true;
    }
  });
};