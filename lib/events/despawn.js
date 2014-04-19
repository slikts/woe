'use strict';

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;
    var key = subject.toString();

    delete state.ents[key];

    state.limbo[key] = subject;

    return spec;
  }
};