'use strict';

var Block = require('../entities/block');

module.exports = function(state) {
  return function(spec) {
    console.log(123, spec);
    // var subject = spec.subject;

    // state.ents[subject.toString()] = subject;

    // return spec;
  };
};