'use strict';

var compose = require('koa-compose');
var _ = require('lodash');

module.exports = function(logger, options) {
  options = _.defaults(options, {
    methods: ['GET'],
    throw: true
  });
  var routes = options.methods;

  var data = require('./lib/router/data')(logger, routes);

  return compose([
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
};
