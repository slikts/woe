'use strict';

var proto = Character.prototype = require('./base')();
require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);

Object.assign(proto, {
  _type: 'char'
});

function Character(config) {
  var char = Object.create(proto);

  char.init(config);

  return char;
}

module.exports = Character;