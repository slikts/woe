'use strict';

function NPC(spec) {
  this.type = 'npc';
  this.init(spec);
}

var proto = NPC.prototype = require('./base')();

require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);
require('./behaviors/context')(proto);

module.exports = NPC;