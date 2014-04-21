'use strict';

var mutate = require('./mutate');

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;

    function move(dt) {
      var x = subject._x;
      var y = subject._y;
      var angle = spec.props._heading * Math.PI / 180;
      var r = dt / 1000 * subject._speed;
      var props = {
        _heading: spec.props._heading
      };

      var _x = x + r * Math.sin(angle);
      var _y = y + r * Math.cos(angle);

      if (_x !== x) {
        props._x = _x;
      }
      if (_y !== y) {
        props._y = _y;
      }

      return mutate({
        subject: subject,
        props: props
      });
    }

    move.spec = spec;

    return move;
  };
};