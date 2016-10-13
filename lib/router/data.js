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

var Insert = require('./../insert');
var Select = require('./../select');
var Update = require('./../update');
var Delete = require('./../delete');
var Count = require('./../count');

var _ = require('lodash');

module.exports = function(logger, routes) {
  var router = require('koa-router')({prefix: '/data'});

  // TABLE
  router.param('table', function * checkTableIsNotInternal(table, next) {
    if (_.startsWith(table, 'pg_')) {
      throw Boom.forbidden('You cannot access internal tables.');
    }

    // to prevent sql injection
    if (table.match(/;/)) {
      return Boom.badRequest('Syntax error');
    }

    this.table = table;
    yield next;
  });

  // GET
  if (routes.indexOf('GET') !== -1) {
    var select = new Select(logger);
    var count = new Count(logger);

    // COUNT
    router.get('/:table/count/:count', function* deleteDataHandler() {
      this.body = yield count.query(this.request.db, this.table, this.params, this.request.query, this.request.dbqueries).then(data => data[0]);
    });

    // GET
    router.get('/:table', function* fetchDataHandler() {
      this.body = yield select.query(this.request.db, this.table, {}, this.request.query, this.request.dbqueries);
    });
  }

  // POST
  if (routes.indexOf('POST') !== -1) {
    var insert = new Insert(logger);

    router.post('/:table', function* addDataHandler() {
      if (!this.is('json')) {
        throw Boom.badRequest('Content-Type needs to be "application/json"');
      }

      this.body = yield insert.query(this.request.db, this.table, this.request.body, {}, this.request.dbqueries);
    });
  }

  if (routes.indexOf('PATCH') !== -1) {
    var update = new Update(logger);
    router.patch('/:table', function* updateDatahandler() {
      if (!this.is('json')) {
        throw Boom.badRequest('Content-Type needs to be "application/json"');
      }

      this.body = yield update.query(this.request.db, this.table, this.request.body, this.request.query, this.request.dbqueries);
    });
  }

  if (routes.indexOf('DELETE') !== -1) {
    var delet = new Delete(logger);
    router.delete('/:table', function* deleteDataHandler() {
      this.body = yield delet.query(this.request.db, this.table, {}, this.request.query, this.request.dbqueries);
    });
  }

  return router;
};
