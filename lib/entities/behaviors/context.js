'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _context: {},
    _range: 5,
    _filter: function(subject) {
      if (subject === this) {
        return false;
      }

      // XXX
      return true;
    },
    _initContext: function(ents) {
      var context = this._context;
      var ent;

      for (var key in ents) {
        ent = ents[key]
        if (this._filter(ent)) {
          context[key] = ent;
        }
      }
    }
  });
};