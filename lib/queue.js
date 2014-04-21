'use strict';

function Queue(logger, Ticker, types, config) {
  var queue = Object.create(proto);

  queue._logger = logger;
  queue._ticker = Ticker();
  queue._types = types;
  queue.init(config);

  return queue;
}

function _empty() {}

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
    var config = this._config;
    var info = Object.create(config);
    info.debug = Object.keys(this._config.debug).filter(function(key) {
      return config.debug[key];
    }).join(',');
    info.name = 'queue';

    this._logger.debug(info, 'running');

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
  _emit: function(event, dt, done) {
    if (event === null) {
      return;
    }

    var listeners = this._listeners;
    var typeListeners = listeners[event.type];
    var genericListeners = listeners['*'];
    var count = 0;
    var key;
    var next;

    if (done) {
      next = function() {
        count -= 1;

        if (count === 0) {
          done();
        }
      };
    } else {
      // XXX
      next = _empty;
    }

    for (key in typeListeners) {
      count += 1;
      setImmediate(typeListeners[key], event, dt, next);
    }

    for (key in genericListeners) {
      count += 1;
      setImmediate(genericListeners[key], event, dt, next);
    }

    if (done && count === 0) {
      done();
    }
  },
  _tick: function(done, dt) {
    var _events = this._events;
    var count = 0;
    var key;

    function next() {
      count -= 1;

      if (count === 0) {
        done();
      }
    }

    for (key in _events) {
      count += 1;
      this._emit(_events[key](dt), dt, next);
    }

    if (count === 0) {
      done();
    }
  },
  _debug: function() {
    var config = this._config.debug;

    function logSpec(method, name) {
      return function(event) {
        this._logger.debug({
          name: 'queue',
          type: event.type,
          eventName: event.name,
          subject: event.subject.toString()
        }, name);

        method.apply(this, arguments);
      };
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