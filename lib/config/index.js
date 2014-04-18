'use strict';

var config = require('./defaults');
var env = process.env.ENV || 'dev';

function extend(target, source) {
  Object.keys(source).forEach(function(key) {
    var sourceItem = source[key];
    var targetItem = target[key];

    if (sourceItem instanceof Object && targetItem !== undefined) {
      extend(targetItem, sourceItem);
    } else {
      target[key] = sourceItem;
    }
  });
}

try {
  extend(config, require('./' + env));
} catch (err) {}

module.exports = config;