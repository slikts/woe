'use strict';

var mutate = require('./mutate');

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;

    function move(dt) {
      // XXX temp
      var x = subject._x;
      var y = subject._y;
      var heading = spec.props._heading;
      var distance = dt / 1000 * subject._speed;
      var props = {
        _heading: spec.props._heading
      };

      if (heading === 'left') {
        props._x = x - distance;
      } else if (heading === 'right') {
        props._x = x + distance;
      } else if (heading === 'up') {
        props._y = y - distance;
      } else if (heading === 'down') {
        props._y = y - distance;
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