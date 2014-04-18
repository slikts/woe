'use strict';

var mutate = require('./mutate');

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;
    var props = spec.props;

    for (var key in spec.props) {
      subject[key] = props[key];
    }

    state.ents[subject.toString()] = subject;

    return spec;
  }
};