'use strict';

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;

    state.ents[subject.toString()] = subject;

    return spec;
  };
};