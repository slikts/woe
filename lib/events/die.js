'use strict';

var mutate = require('./mutate');

module.exports = function(state) {
  return function(spec) {
    delete state.ents[subject.toString()] = subject;

    return spec;
  }
};