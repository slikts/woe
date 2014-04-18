'use strict';

module.exports = function(state) {
  return {
    move: require('./move')(state),
    spawn: require('./spawn')(state),
    mutate: require('./mutate')
  }
};