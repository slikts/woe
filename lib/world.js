'use strict';

var http = require('http');
var express = require('express');
var io = require('socket.io');

var Client = require('./client');

function World(logger, queue, state, config) {
  var world = Object.create(proto);
  var app = world._app = express();
  var server;
  var sio;

  if (config.serveStatic) {
    app.use(express.static(__dirname + '/static'));
  }
  app.disable('x-powered-by');

  app.use('/info', world._info.bind(world));

  world._logger = logger;
  world._queue = queue;
  world._config = config;
  world._state = state;

  state._grid._setWorldSize(config.size);

  world._clients = {};

  world._connect = world._connect.bind(world);

  server = world._server = http.createServer(app);

  sio = world._sio = io.listen(server, {
    logger: ioLogger(logger, 'io'),
    authorization: world._auth.bind(world)
  });

  sio.sockets.on('connection', world._connect);

  return world;
}

var proto = World.prototype = {
  run: function() {
    if (!this._state.loaded) {
      this._logger.info(this._config, 'running world');

      this._state.load(this.run.bind(this));

      return;
    }

    this._started = Date.now();

    this._queue.start();

    var queue = this._queue;
    var state = this._state;

    queue.listen('mutate', 'state', state._listener);
    queue.listen('spawn', 'state', state._listener);
    queue.listen('despawn', 'state', state._listener);

    this._server.listen(this._config.port);

    // XXX XXX XXX

    // var s = this._state;
    // var npc = s.ents['npc_test'];
    // // queue.push(npc.move());
    // // queue.push(s.ents['npc_test2'].move());
    // var n3 = s.ents['npc_test3'];
    // var q = false;
    // setInterval(function() {
    //   if (q) {
    //     queue.push(n3.spawn());
    //   } else {
    //     queue.push(n3.despawn());
    //   }
    //   q = !q;
    // }, 1000);
  },
  dump: function() {
    // XXX
  },
  _auth: function(handshakeData, callback) {
    var auth = false;
    var query = handshakeData.query;
    var user = this._state.limbo['user_' + query.user];

    if (user) {
      // XXX
      auth = query.password === user.password;
    }

    // XXX
    callback(null, true);
    // callback(null, auth);
  },
  _connect: function(socket) {
    var client = new Client(socket, this._state, this._queue, this._logger);

    socket.on('disconnect', this._disconnect.bind(this, client));

    this._clients[client] = client;
  },
  _disconnect: function(client) {
    delete this._clients[client.toString()];
  },
  _info: function(req, res, next) {
    var data = {
      env: this._config.env,
      name: this._config.name
    };

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(data));
  }
};

function ioLogger(bunyan, name) {
  var levels = ['error', 'warn', 'info', 'debug'];
  var logger = {};

  levels.forEach(function(level) {
    logger[level] = function() {
      bunyan[level].apply(bunyan, [{
        name: name
      }].concat(Array.prototype.slice.call(arguments, 0)));
    };
    // XXX
    // logger[level] = function() {};
  });

  return logger;
}

module.exports = function(logger, queue, state) {
  return World.bind(null, logger, queue, state);
};