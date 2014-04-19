'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _position: true,
    _x: 0,
    _y: 0,
    _z: 0,
    _heading: 0
  });
};