'use strict';

module.exports = function(state) {
  return {
    move: require('./move')(state),
    spawn: require('./spawn')(state),
    despawn: require('./spawn')(state),
    die: require('./die')(state),
    mutate: require('./mutate')
  }
};