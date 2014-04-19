'use strict';

module.exports = function(state) {
  return {
    move: require('./move')(state),
    spawn: require('./spawn')(state),
    despawn: require('./despawn')(state),
    mutate: require('./mutate')
  }
};