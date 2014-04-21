'use strict';

var Block = require('../entities/block');

module.exports = function(state) {
  var spawn = require('./spawn')(state);

  return function(spec) {
    var subject = spec.subject;
    var block = new Block({
      _x: Math.floor(subject._x),
      _y: Math.floor(subject._y),
      _z: Math.floor(subject._z - 1),
    });

    if (state.ents[block.toString()]) {
      return null;
    }

    return spawn({
      type: 'spawn',
      subject: block,
      props: block
    });
  };
};