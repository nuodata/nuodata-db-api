# Nuodata DB API

REST API for PostgreSQL.

[![Build Status](https://travis-ci.org/nuodata/nuodata-db-api.svg?branch=master)](https://travis-ci.org/nuodata/nuodata-db-api)

## Usage

```javascript
var nuodata = require('nuodata-pg-api');
var app = nuodata();

// Nuodata DB API uses KoaJS, if you want to extend it to your needs you can use (see http://koajs.com/ for more info)
app.koa.use(function* (next) {
  // add whatever code you want, will be executed first
  yield next;
});

// this will execute the setup script on every start up, you can choose
app.init({
  globalDb: process.env.DATABASE_URL, // if you want a global DB object for your database, pass the dsn. Basically if your app connects to only one database
  logLevel: 'fatal'|'error'|'warn'|'info'|'debug'| // the log level used by the bunyan logger (default 'info'), see https://github.com/trentm/node-bunyan for more info
  logRequest: true|false // whether to log request, using INFO logging level
  logStreams: [] // an array of log streams, see https://github.com/trentm/node-bunyan for more information
});
app.start(3000);


```

## Example

### Get some users data
```
GET /data/users?limit=2&name=like::J*
```
```json
[{"name": "John", "age": 22}, {"name": "Jessie", "age": 30}]
```

### Count some users data
```
GET /data/count/users/name?name=like::J*
```
```json
{"count":"2"}
```

### Update some users data
```
PATCH /data/users?name=eq::Jessie
Content-Type application/json
{
  "age": 23
}
```
```json
[{"name": "John", "age": 22}, {"name": "Jessie", "age": 23}]
```

### Create some new data
```
POST /data/users
Content-Type application/json
{
  "name": "Joe",
  "age": 21
}
```
```json
[{"name": "Joe", "age": 21}]
```

### Delete some users data
```
GET /data/users?name=eq::John
```
```json
[{"name": "John", "age": 22}]
```
