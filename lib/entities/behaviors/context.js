'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _listening: true,
    _context: {},
    _range: 10,
    _filter: function(event) {
      var ent = event.subject;

      if (ent._position === undefined || ent === this) {
        return false;
      }

      var range = this._range;
      var context = this._context;
      var key = ent.toString();
      var type = event.type;

      if (this._proximate(ent, range)) {
        if (type === 'spawn' || type === 'mutate') {
          context[key] = ent;
        }

        if (type === 'despawn') {
          delete context[key];
        }

        return true;
      } else if (context[key] !== undefined) {
        delete context[key];
      }

      return false;
    }
  });
};