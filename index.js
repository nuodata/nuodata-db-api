'use strict';

var compose = require('koa-compose');
var _ = require('lodash');

module.exports = function(logger, options) {
  var db;
  var middlewares = [];

  options = _.defaults(options, {
    methods: ['GET'],
    throw: true,
  });
  var routes = options.methods;

  const pgp = require('pg-promise')({
    promiseLib: require('bluebird')
  });

  var data = require('./lib/router/data')(logger, routes);

  if (options.connection) {
    logger.info('Using connection ', options.connection);
    db = pgp(options.connection);
    middlewares = [function* (next) {
      this.request.db = db;
      yield next;
    }];
  }

  middlewares = middlewares.concat([
    function* errorHandler(next) {
      try {
        yield next;
      } catch (err) {
        logger.error(err);

        var error = require('./lib/errorHandler')(err);

        this.response.status = error.output.statusCode;
        this.response.type = 'json';
        this.response.body = JSON.stringify({message: error.output.payload.message});
      }
    },

    require('koa-parse-json')(),

    function* (next) {
      // set pre queries
      this.request.dbqueries = [];
      yield next;
    },

    data.routes(),
    data.allowedMethods({
      throw: options.throw,
      notImplemented: () => new Boom.notImplemented(),
      methodNotAllowed: () => new Boom.methodNotAllowed()
    })
  ]);

  return compose(middlewares);
};
