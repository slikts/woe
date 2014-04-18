'use strict';

var entities = ['block', 'character'];

entities.forEach(function(name) {
  module.exports[name] = require('./' + name);
});