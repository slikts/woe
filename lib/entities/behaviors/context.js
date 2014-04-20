'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _listening: true,
    _context: {},
    _range: 10,
    _filter: function(ent) {
      if (ent._position !== undefined && ent !== this) {
        var x = this._x;
        var y = this._y;
        var z = this._z;
        var range = this._range;
        var ex = ent._x;
        var ey = ent._y;
        var ez = ent._z;
        var key = ent.toString();
        var context = this._context;

        if (ex >= x - range && ex <= x + range && ey >= y - range && ey <= y + range && ez >= z - range && ez <= z + range) {
          return true;
        } else if (context[key] !== undefined) {
          delete context[key];
        }

        return false;
      }
    }
  });
};