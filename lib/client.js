'use strict';

var Player = require('./entities/player');

function Client(socket, state, queue, logger) {
  var handshake = socket.handshake;

  this._logger = logger;
  this._socket = socket;
  this._state = state;
  this._queue = queue;

  this._logger.info({
    name: 'client',
    address: handshake.address.address + ':' + handshake.address.port,
    id: socket.id
  }, 'connected');

  this._data = handshake.query;

  socket.on('disconnect', this._disconnected.bind(this));

  socket.on('move', function(data) {
    console.log('move');
  });

  this._spawn();
}

Client.prototype = {
  toString: function() {
    return 'client_' + this._socket.id;
  },
  _disconnected: function() {
    this._logger.info({
      name: 'client',
      id: this._socket.id
    }, 'disconnected');

    this._queue.push(this._player.despawn());
  },
  _spawn: function() {
    var id = this._data.player;
    var player = this._state.ents['player_' + id];

    if (!player) {
      player = new Player({
        _id: id
      });
    }

    this._queue.push(player.spawn());

    this._player = player;
  }
};

module.exports = Client;