'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _position: true,
    _x: 0,
    _y: 0,
    _z: 0,
    _heading: 0,
    _proximate: function(ent, range) {
      var x = this._x;
      var y = this._y;
      var z = this._z;
      var ex = ent._x;
      var ey = ent._y;
      var ez = ent._z;

      return ex >= x - range && ex <= x + range && ey >= y - range && ey <= y + range && ez >= z - range && ez <= z + range;
    }
  });
};