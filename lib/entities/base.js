'use strict';

var maxIds = {};

var proto = Object.create(null);

Object.assign(proto, {
  init: function(config) {
    Object.assign(this, config || {});

    if (maxIds[this._type] === undefined) {
      maxIds[this._type] = 0;
    }

    if (!this._id) {
      this._id = maxIds[this._type] += 1;
    } else if (this._id > maxIds[this._type]) {
      maxIds[this._type] = this._id;
    }

    return this;
  },
  toString: function() {
    return this._type + '_' + this._id;
  },
  event: function(type, props, named) {
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
  stop: function(type) {
    return {
      type: 'stop',
      name: this._eventName(type)
    };
  },
  _eventName: function(type) {
    return type + '_' + this.toString();
  }
});

module.exports = function() {
  return Object.create(proto);
};