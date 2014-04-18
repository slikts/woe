'use strict';

var levelup = require('levelup');

function State(entities, config) {
  var state = Object.create(proto);

  state._config = config;
  state._entities = entities;

  state.ents = {};

  state._listener = state._listener.bind(state);

  state._connect();

  return state;
}

var proto = State.prototye = {
  load: function() {

  },
  _listener: function(event) {
    this._db.put(event.subject.toString(), JSON.stringify(event.subject));
  },
  _connect: function() {
    var options = {};

    if (this._config.memory) {
      options.db = require('memdown');
    }

    this._db = levelup(this._config.path, options);
  }
};

module.exports = function(entities) {
  return State.bind(null, entities);
};