'use strict';

var maxIds = {};

module.exports = function(proto) {
  Object.assign(proto, {
    init: function(spec) {
      for (var prop in spec) {
        this[prop] = spec[prop];
      }

      var type = this.type;

      if (maxIds[type] === undefined) {
        maxIds[type] = 0;
      }

      if (!this._id) {
        this._id = maxIds[type] += 1;
      } else if (this._id > maxIds[type]) {
        maxIds[type] = this._id;
      }
    },
    toString: function() {
      return this.type + '_' + this._id;
    },
    stop: function(type) {
      return {
        type: 'stop',
        name: this._eventName(type)
      };
    },
    spawn: function() {
      return this._event('spawn');
    },
    _event: function(type, props, named) {
      var spec = {
        type: type,
        props: props,
        subject: this
      };

      if (named) {
        spec.name = this._eventName(type);
      }

      return spec;
    },
    _eventName: function(type) {
      return type + '_' + this.toString();
    }
  });
};