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
'use strict';

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// REQUIRE
const cors = require('koa-cors');
const config = require('config');
var app = module.exports = require('koa')();


// LOGGER
var logger = app.logger = require('bunyan').createLogger({
  name: config.get('logger.name'),
  streams: config.has('logger.streams') ? config.get('logger.streams') : [{stream: process.stdout, level: 'info'}]
});

// DATABASE
app.pgp = function () {
  return require('pg-promise')({
    'pgFormatting': true
  });
};

// check where we get db configuration from
var dbfrom = config.get('database.from');
if (dbfrom === 'dsn') {
  let pgp = app.pgp();
  app.db = pgp(config.get('database.dsn'));
  app.logger.info('Connecting to database on %s', config.get('database.dsn'));
}

// CORS
app.use(cors(Object.assign({}, config.get('cors'))));


// ERROR HANDLER
app.use(function* errorHandler(next) {
  try {
    yield next;
  } catch (err) {
    app.logger.error(err);

    var error = require('./lib/errorHandler')(err);

    this.response.status = error.output.statusCode;
    this.response.type = 'json';
    this.response.body = JSON.stringify({message: error.output.payload.message});
  }
});

// PARSE JSON BODY
app.use(require('koa-parse-json')());

// SETUP REQUEST CONTEXT
app.use(function* (next) {
  // set db
  if (dbfrom === 'dsn') {
    this.request.db = this.app.db;
  }

  // set pre queries
  this.request.dbqueries = [];
  yield next;
});

// DATA ROUTES
var data = require('./lib/router/data')(app.logger);
app.use(data.routes());
app.use(data.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed()
}));

app.start = function(port) {
  var server = require('http').createServer(app.callback());

  server.listen(port, function () {
    var details = server.address();
    app.logger.info('Starting server on %s address http://%s:%s', details.family, details.address, details.port);
    app.emit('started');
  });

  return server;
};

// start the server if `$ node server.js`
if (require.main === module)
  app.start(config.get('api.port'));
