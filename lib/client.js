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

    this._queue.push({
      type: 'global',
      subject: this._avatar,
      props: {
        message: 'disconnected',
        time: Date.now()
      }
    });

    delete this._state._avatars[this._avatar._id];

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

    var queue = this._queue;

    function _emitEvent(event) {
      socket.emit('event', {
        type: event.type,
        subject: event.subject.toString(),
        props: event.props
      });
    }

    queue.listen('*', this.toString(), function(event, dt, done) {
      // XXX use grid proximity
      if (event.type !== 'global' && !avatar._proximate(event.subject, range)) {
        done();

        return;
      }

      // send proximate event
      _emitEvent(event);

      done();
    });

    this._queue.push({
      type: 'global',
      subject: avatar,
      props: {
        message: 'connected',
        time: Date.now()
      }
    });

    queue.push(avatar.spawn(true));

    this._state._avatars[avatar._id] = avatar;

    this._logger.info({
      name: 'client',
      id: avatar._id
    }, 'avatar spawn');

    var range = avatar._range;
    var socket = this._socket;

    this._state._grid.query(avatar, avatar._range, function(key, ent) {
      // send initial context
      _emitEvent(ent.spawn(true));
    });

    var state = this._state;

    setImmediate(function() {
      socket.emit('event', {
        type: 'global',
        subject: '',
        props: {
          time: Date.now(),
          message: 'online: ' + Object.keys(state._avatars).join(', ')
        }
      });
    });

    socket.on('event', function(event) {
      queue.push(avatar[event.type].apply(avatar, event.props));
    });

    this._avatar = avatar;
  }
};

module.exports = Client;