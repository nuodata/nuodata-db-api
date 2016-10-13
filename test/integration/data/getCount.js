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

var log = function (res) {
  console.log(res.body);
};

describe('GET /data/:table/count/:count', function(done) {
  before(function (done) {
    _test.db.boot().then(() => {done();});
  });

  it('GET /data/uuid_data/count/uuid', function (done) {
    _test.app.get('/data/uuid_data/count/uuid').expect((res) => {
      res.body['count'].should.be.eq('3');
    }).expect(200, done);
  });

  it('GET /data/dasdsasdsds/count/uuid', function (done) {
    _test.app.get('/data/dasdsasdsds/count/uuid').expect(404, done);
  });

  after(function (done) {
    _test.db.clear().then(() => {done();});
  });
});
