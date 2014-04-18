'use strict';

var levelup = require('levelup');

function State(entities, logger, config) {
  var state = Object.create(proto);

  state._config = config;
  state._entities = entities;
  state._logger = logger;

  state.ents = {};

  state._listener = state._listener.bind(state);

  state._connect();

  return state;
}

var proto = State.prototye = {
  load: function(done) {
    var self = this;
    var queue = this._queue;
    var entities = this._entities;
    var count = 0;

    this._db.createReadStream({
      valueEncoding: 'json'
    })
      .on('data', function(data) {
        var spec = data.value;

        count += 1;

        queue.push((new entities[spec.type](spec)).spawn());
      })
      .on('error', function(err) {
        sel1._logger.error({
          name: 'state'
        }, err.message);
      })
      .on('end', function() {
        if (self._config.fixtures) {
          var fixtures = require('./fixtures');

          fixtures.forEach(function(item) {
            queue.push((new entities[item.type](item)).spawn());
          });

          self._logger.info({
            name: 'state',
            count: fixtures.length
          }, 'loaded fixtures');
        }

        if (count) {
          self._logger.info({
            name: 'state',
            count: count
          }, 'loaded stored entities');
        }

        self.loaded = true;

        done();
      });
  },
  _listener: function(event) {
    var logger = this._logger;
    this._db.put(event.subject.toString(), JSON.stringify(event.subject), function(err) {
      if (err) {
        logger.error({
          name: 'state'
        }, err.message);
      }
    });
  },
  _connect: function() {
    var options = {};

    if (this._config.memory) {
      options.db = require('memdown');
    }

    this._db = levelup(this._config.path, options);
  }
};

module.exports = function(entities, logger) {
  return State.bind(null, entities, logger);
};