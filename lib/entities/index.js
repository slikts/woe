'use strict';

var types = ['block', 'npc', 'avatar', 'user'];

types.forEach(function(name) {
  factory[name] = require('./' + name);
});

function factory(spec) {
  var name = spec.type;

  return new factory[name](spec);
}

module.exports = factory;