# Nuodata DB API

Koa.js middleware REST API for PostgreSQL with automatic API endpoints matching your tables or views.

[![Build Status](https://travis-ci.org/nuodata/nuodata-db-api.svg?branch=master)](https://travis-ci.org/nuodata/nuodata-db-api)

## Usage

### Single server

```javascript
// Instantiate your own koa.js app
var app = require('koa')();

// use your own logger
var logger = app.logger = require('bunyan').createLogger({
  name: config.get('logger.name'),
  streams: [{stream: process.stdout, level: 'info'}]
});

// inject it in the nuodata middleware, along with other options
var nuodata = require('nuodata-db-api')(logger, {
  // exclude some verbs if not allowed (e.g. use ['GET', 'POST'] if users
  // are not allowed to delete or update records at all via the API, you can
  // still control authorization under PostgreSQL even if the HTTP verb is allowed though)
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
});

var router = require('koa-router')();
router.get('/v1', nuodata);
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
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
GET /data/users/count/name?name=like::J*
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

### More documentation

Check the full documentation at http://docs.nuodata.io