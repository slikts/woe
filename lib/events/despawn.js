'use strict';

module.exports = function(state) {
  return function(spec) {
    var subject = spec.subject;
    var key = subject.toString();

    delete state.ents[key];

    if (subject._immortal) {
      state.limbo[key] = subject;
    }

    return spec;
  };
};