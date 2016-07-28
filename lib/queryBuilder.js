/**
 * Nuodata DB API
 * Copyright (C) 2016 Sylvain Verly
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

var squel = require("squel").useFlavour('postgres');
var _ = require('lodash');
var Boom = require('boom');

const OPERATOR_SPLIT = '::';

squel.registerValueHandler(Object, function (object) {
  return JSON.stringify(object);
});

var handleJsonField = function (name) {
  // if the name is a json field
  if (null !== name.match(/\./)) {
    let names = name.split('->');
    name = names[0] + "->'" + names[1] + "'";
  }

  return name;
};

var buildOperation = function (name, operator, value) {
  name = handleJsonField(name);

  if (value == '') {
    value = operator;
    operator = 'eq';
  }

  switch (operator) {
    case 'eq':
      operator = '=';
      break;
    case 'gt':
      operator = '>';
      break;
    case 'gte':
      operator = '>=';
      break;
    case 'lt':
      operator = '<';
      break;
    case 'lte':
      operator = '<=';
      break;
    case 'neq':
      operator = '<>';
      break;
    case 'like':
      operator = 'LIKE';
      value = value.replace(/\*/, '%');
      break;
    case 'ilike':
      operator = 'ILIKE';
      value = value.replace(/\*/, '%');
      break;
    case 'parent':
    case 'is_contained_by':
      operator = '<@';
      break;
    case 'child':
    case 'contains':
      operator = '@>';
      break;
    default:
      throw new Boom.badRequest('Unknown operator ' + operator);
      break;
  }

  return {
    operation: name + ' ' + operator + ' ?',
    value: value
  };
};

var buildWhereExpression = function (columns, params) {
  var expr = columns.reduce((previous, name) => {
    var operation = params[name].split(OPERATOR_SPLIT);
    // the first element is the operator
    var operator = operation.shift();
    // the rest is the values (that can be separated with .)
    var value = operation.join('.');

    if (typeof value === "undefined") {
      throw Boom.badRequest("Operator missing, should be of the form " + name + "=operator" + OPERATOR_SPLIT + operator + " where" +
        " operator can be 'eq', 'neq', 'like', etc");
    }

    let clause = buildOperation(name, operator, value);

    return previous.and(clause.operation, clause.value);
  }, squel.expr());

  return expr;
};

module.exports.squel = squel;
module.exports.handleJsonField = handleJsonField;
module.exports.buildOperation = buildOperation;
module.exports.buildWhereExpression = buildWhereExpression;
