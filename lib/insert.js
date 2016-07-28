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

var _ = require('lodash');
var builder = require('./queryBuilder');
var Boom = require('boom');
var Query = require('./query');

class Insert extends Query {
  /**
   * Build a insert query
   * @param table name of the table
   * @param data data to insert as a json
   * @param params not used here
   * @returns squel.Query
   */
  build(table, data, params) {    if (_.isArray(data)) {
      throw Boom.badRequest('Cannot handle array insert at the moment');
    }

    if (_.isEmpty(data)) {
      throw Boom.badRequest('Nothing to insert');
    }

    var keys = _.keys(data);

    // keys must be valid strings
    keys.forEach(key => {
      if (null === key.match(/[a-zA-Z0-9_]+/)) {
        throw Boom.badRequest('Malformed column name: ' + key);
      }
    });

    var query = builder.squel.insert().into(table);
    if (_.isArray(data)) {
      query.setFieldsRows(data);
    }
    else {
      query.setFields(data);
    }

    query.returning('*');

    return query;
  }
}

module.exports = Insert;
