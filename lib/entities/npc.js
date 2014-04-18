'use strict';

function NPC(config) {
  this.type = 'npc'
  this.init(config);
}

var proto = NPC.prototype = Object.create(null);

require('./behaviors/base')(proto);
require('./behaviors/movement')(proto);
require('./behaviors/hp')(proto);
require('./behaviors/say')(proto);

module.exports = NPC;