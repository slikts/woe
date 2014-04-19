'use strict';

var Avatar = require('./entities/avatar');

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

    this._queue.unlisten('*', this.toString());

    this._queue.push(this._avatar.despawn());
  },
  _spawn: function() {
    var id = this._data.user;
    var limbo = this._state.limbo;
    var key = 'avatar_' + id;
    var avatar = limbo[key];

    if (!avatar) {
      avatar = limbo[key] = new Avatar({
        _id: id
      });
    }

    this._queue.push(avatar.spawn(true));

    this._queue.listen('*', this.toString(), function(spec) {
      if (!avatar._filter(spec)) {
        return;
      }

      // XXX context
      console.log('context');
    });

    this._avatar = avatar;
  }
};

module.exports = Client;