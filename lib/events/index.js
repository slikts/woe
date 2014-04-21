'use strict';

module.exports = function(state) {
  return {
    move: require('./move')(state),
    spawn: require('./spawn')(state),
    despawn: require('./despawn')(state),
    mutate: require('./mutate'),
    // XXX temp
    create: require('./_create')(state),
    uncreate: require('./_uncreate')(state)
  };
};