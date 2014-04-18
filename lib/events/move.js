'use strict';

var mutate = require('./mutate');

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;

    function move(dt) {
      // XXX calc
      var x = subject._x + 1;
      var y = subject._y + 1;

      return mutate({
        subject: subject,
        props: {
          _heading: spec.props._heading,
          _x: x,
          _y: y
        }
      });
    }

    move.spec = spec;

    return move;
  };
};