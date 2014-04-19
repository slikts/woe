'use strict';

function Queue(logger, Ticker, types, config) {
  var queue = Object.create(proto);

  queue._logger = logger;
  queue._ticker = Ticker();
  queue._types = types;
  queue.init(config);

  return queue;
}

var proto = Queue.prototype = {
  init: function(config) {
    var self = this;
    var _tick = this._tick;

    this._config = config;
    this._events = {};
    this._listeners = {
      '*': {}
    };
    this._ticker.use({
      delay: config.interval,
      async: true,
      task: function(done, dt) {
        _tick.call(self, done, dt);
      }
    });

    this._debug();
  },
  start: function() {
    this._logger.debug({
      'config': this._config
    }, 'starting queue');

    this._ticker.start();
  },
  push: function(spec) {
    var event;
    var handler;

    if (spec.type === 'stop') {
      delete this._events[spec.name];

      return;
    }

    handler = this._types[spec.type];
    event = handler ? handler(spec) : spec;

    if (spec.name) {
      // Queue named event
      this._events[spec.name] = event;
    } else {
      this._emit(event);
    }
  },
  listen: function(type, name, fn) {
    var listeners = this._listeners[type];

    if (!listeners) {
      listeners = this._listeners[type] = {};
    }

    listeners[name] = fn;
  },
  unlisten: function(type, name) {
    delete this._listeners[type][name];
  },
  _emit: function(event, dt) {
    var listeners = this._listeners;
    var typeListeners = listeners[event.type];
    var genericListeners = listeners['*'];
    var key;

    for (key in typeListeners) {
      typeListeners[key](event, dt);
    }

    for (key in genericListeners) {
      genericListeners[key](event, dt);
    }
  },
  _tick: function(done, dt) {
    var _events = this._events;
    var key;

    for (key in _events) {
      this._emit(_events[key](dt), dt);
    }

    done();
  },
  _debug: function() {
    var config = this._config.debug;

    function logSpec(method, name) {
      return function(spec) {
        this._logger.debug({
          name: 'queue',
          type: spec.type,
          subject: spec.subject.toString()
        }, name);

        method.call(this, spec);
      }
    }

    if (config.push) {
      this.push = logSpec(this.push, 'push');
    }

    if (config.emit) {
      this._emit = logSpec(this._emit, 'emit');
    }
  }
};

module.exports = function(logger, Ticker, types) {
  return Queue.bind(null, logger, Ticker, types);
};