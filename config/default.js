const defer = require('config/defer').deferConfig;
const raw = require('config/raw').raw;
const path = require('path');

module.exports = {
  // API
  api: {
    port: 4000
  },

  // logger
  logger: {
    name: 'nuodata-db-api'
  },

  // CORS
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    headers: ['Content-Type', 'Authorization']
  },

  database: {
    from: 'dsn', // [dsn, header]
    dsn: 'postgres://localhost'
  }
};