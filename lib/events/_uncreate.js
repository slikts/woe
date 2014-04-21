'use strict';

var Block = require('../entities/block');

module.exports = function(state) {
  var despawn = require('./despawn')(state);
  return function(spec) {
    var subject = spec.subject;

    var block = new Block({
      _x: Math.floor(subject._x),
      _y: Math.floor(subject._y),
      _z: Math.floor(subject._z - 1),
    });

    var eblock = state.ents[block.toString()];

    if (eblock) {
      return despawn({
        type: 'despawn',
        subject: eblock
      });
    };
    return null;
  };
};