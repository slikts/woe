'use strict';

var levelup = require('levelup');

function State(entities, grid, logger, config) {
  var state = Object.create(proto);

  state._config = config;
  state._entities = entities;
  state._logger = logger;
  state._grid = grid;

  state.ents = {};
  state.limbo = {};

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
        var ent = entities(spec);

        count += 1;

        queue.push(ent.spawn());
      })
      .on('error', function(err) {
        sel1._logger.error({
          name: 'state'
        }, err.message);
      })
      .on('end', function() {
        if (self._config.fixtures) {
          self._fixtures();
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
  _fixtures: function() {
    var fixtures = require('./fixtures');
    var queue = this._queue;
    var entities = this._entities;

    fixtures.forEach(function(spec) {
      queue.push(entities(spec).spawn());
    });

    this._logger.info({
      name: 'state',
      count: fixtures.length
    }, 'loaded fixtures');
  },
  _listener: function(event, dt, done) {
    var logger = this._logger;
    var subject = event.subject;
    var key = subject.toString();

    if (subject._position) {
      if (event.type === 'despawn') {
        this._grid.forget(key);
      } else {
        this._grid.update(key, subject);
      }
    }

    this._db.put(key, JSON.stringify(subject), function(err) {
      if (err) {
        logger.error({
          name: 'state'
        }, err.message);
      }
    });

    done();
  },
  _connect: function() {
    var options = {};

    if (this._config.memory) {
      options.db = require('memdown');
    }

    this._db = levelup(this._config.path, options);
  },
  _grid: function(size) {

  }
};

module.exports = function(entities, grid, logger) {
  return State.bind(null, entities, grid, logger);
};