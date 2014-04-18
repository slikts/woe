'use strict';

module.exports = function(state) {
  return {
    move: require('./move')(state),
    mutate: require('./mutate')
  }
};