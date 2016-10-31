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
var builder = require('./builder/query.js');
var Boom = require('boom');
var Query = require('./query');

var buildOrderStatement = function (query, orders) {
  return orders.map(value => {
    let type = value.split('::');
    let orderType = type[0].toLowerCase();
    let name = type[1];

    if (orderType !== 'asc' && orderType !== 'desc') {
      throw Boom.badRequest("Invalid order '" + orderType + "', valid values are 'desc' or 'asc'");
    }

    return query.order(name, orderType === 'asc');
  });
};

class Select extends Query {
  /**
   * Build a select query
   * @param table name of the table
   * @param data not used here
   * @param params select object
   * @returns squel.Query
   */
  build(table, data, params) {
    // get the queried columns, remove the reserved words, as they are not columns
    var columns = _.keys(_.omit(params,
      '_order', '_limit', '_page'
    ));

    var query = builder.squel.select().from(table);

    if (columns.length !== 0) {
      query.where(builder.buildWhereExpression(columns, params));
    }

    // build order statement
    if (params._order !== undefined) {
       buildOrderStatement(query, params._order.split(','));
    }

    // build the limit statement, default to 25
    let limit = params._limit !== undefined ? parseInt(params._limit) : 25;
    query.limit(limit);

    if (params._page !== undefined) {
      let page = parseInt(params._page);

      if (page === 0) {
        throw Boom.badRequest('Page cannot be 0, should start at 1');
      }

      query.offset((page - 1) * limit);
    }

    return query;
  }
}

module.exports = Select;

