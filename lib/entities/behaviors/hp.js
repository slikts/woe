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
      var hp = this._hp - hp * this._defense;

      if (hp) {
        return this._event('mutate', {
          _hp: hp
        });
      } else {
        return this.die();
      }
    },
    die: function() {
      return this._event('die');
    }
  });
};