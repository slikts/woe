'use strict';

module.exports = function(spec) {
  var subject = spec.subject;
  var props = spec.props;

  for (var key in props) {
    subject[key] = props[key];
  }

  spec.type = 'mutate';

  return spec;
};