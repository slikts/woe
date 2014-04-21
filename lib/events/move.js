'use strict';

var mutate = require('./mutate');

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;

    function move(dt) {
      var x = subject._x;
      var y = subject._y;
      var heading = spec.props._heading;
      var angle = heading * Math.PI / 180;
      var r = dt / 1000 * subject._speed;
      var props = {};

      if (subject._heading !== heading) {
        props._heading = heading;
      }

      var _x = x + r * Math.sin(angle);
      var _y = y + r * Math.cos(angle);

      if (_x !== x) {
        props._x = Math.round(_x * 1000) / 1000;
      }
      if (_y !== y) {
        props._y = Math.round(_y * 1000) / 1000;
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