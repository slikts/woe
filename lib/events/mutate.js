'use strict';

module.exports = function(spec) {
  var subject = spec.subject;
  var props = spec.props;
  var key;

  for (key in props) {
    subject[key] = props[key];
  }

  return {
    type: 'mutate',
    subject: spec.subject,
    props: spec.props
  };
};