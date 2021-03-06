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

const pgp = require('pg-promise')({
  promiseLib: require('bluebird')
});
const path = require('path');

var pg = pgp(process.env.DATABASE_URL);

var bootdb = function () {
  return pg.any(new pgp.QueryFile(path.join(__dirname, 'bootstrap.sql'), {minify: true})).catch(function(err) {
    console.error(err);
    throw err;
  });
};

var cleardb = function () {
  return pg.any(new pgp.QueryFile(path.join(__dirname, 'clear.sql'), {minify: true})).catch(function (err) {
    console.error(err);
    throw err;
  });
};

var app = require('koa')();
var nuodata = require('require-main')();
nuodata = nuodata(
  require('bunyan').createLogger({
    name: 'nuodata-db-api',
    streams: [{
      level: 'fatal',
      stream: process.stdout
    }]
  }), {
    connection: process.env.DATABASE_URL,
    methods: ['GET', 'DELETE', 'POST', 'PATCH']
  }
);
app.use(nuodata);

global._test = {
  pg: pg,
  app: require('supertest-koa-agent')(app),
  db: {
    boot: bootdb,
    clear: cleardb
  }
};

require('chai').should();
global.chance = require('chance').Chance();
global.sprintf = require("sprintf-js").sprintf;
