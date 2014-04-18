'use strict';

var entities = ['block', 'npc', 'player'];

entities.forEach(function(name) {
  module.exports[name] = require('./' + name);
});