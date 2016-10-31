'use strict';

var sprintf = require("sprintf-js").sprintf;

var operators = {};

operators.eq = function (name, value) {
  return {
    operation: sprintf('%s = ?', name),
    value: value
  };
};

operators.neq = function (name, value) {
  return {
    operation: sprintf('%s <> ?', name),
    value: value
  };
};

operators.gt = function(name, value) {
  return {
    operation: sprintf('%s > ?', name),
    value: value
  };
};

operators.gte = function (name, value) {
  return {
    operation: sprintf('%s >= ?', name),
    value: value
  };
};

operators.lt = function (name, value) {
  return {
    operation: sprintf('%s < ?', name),
    value: value
  };
};

operators.like = function (name, value) {
  return {
    operation: sprintf('%s LIKE ?', name),
    value: value
  };
};

operators.ilike = function (name, value) {
  return {
    operation: sprintf('%s ILIKE ?', name),
    value: value
  };
};

operators.parent = function (name, value) {
  return {
    operation: sprintf('%s @> ?', name),
    value: value
  };
};

operators.is_contained_by = function (name, value) {
  return operators.parent(name, value);
};

operators.child = function (name, value) {
  return {
    operation: sprintf('%s <@ ?', name),
    value: value
  };
};

operators.contains = function (name, value) {
  return operators.child(name, value);
};

module.exports = operators;