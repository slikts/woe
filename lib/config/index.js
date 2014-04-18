'use strict';

var xtend = require('xtend');
var config = require('./defaults');
var env = process.env.ENV || 'dev';

try {
  config = xtend(config, require('./' + env));
} catch (err) {}

module.exports = config;