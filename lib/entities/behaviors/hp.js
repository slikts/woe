'use strict';

module.exports = function(proto) {
  Object.assign(proto, {
    _hp: 1,
    _baseHp: 1,
    _defense: 0.5,
    heal: function(hp) {
      return this._event('mutate', {
        _hp: Math.min(this._baseHp, this._hp + hp)
      });
    },
    damage: function(hp) {
      return this._event('mutate', {
        _hp: this._hp - hp * this._defense
      });
    }
  });
};