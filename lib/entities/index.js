'use strict';

var types = ['block', 'npc', 'player', 'user'];

types.forEach(function(name) {
  factory[name] = require('./' + name);
});

function factory(spec) {
  var name = spec.type;

  return new factory[name](spec);
}

module.exports = factory;