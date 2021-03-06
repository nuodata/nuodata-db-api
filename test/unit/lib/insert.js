/**
 * Manati PostgreSQL REST API
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

var Insert = manati_test_require('lib/insert.js');

describe('insert', function () {
  it('insert::build() with simple data', function() {
    var insert = new Insert();
    var query = insert.build('table', {"number": 1, "string": "string", "float": 1.22});
    query = query.toParam();

    query.text.should.be.equal("INSERT INTO table (number, string, float) VALUES ($1, $2, $3) RETURNING *");
    query.values.should.be.deep.equal([1,'string', 1.22]);
  });

  it.skip('insert::build() with array', function () {
    var insert = new Insert();
    var query = insert.build('table', {"array": ['data', '1', '2']});
    query = query.toParam();

    query.text.should.be.equal("INSERT INTO table (array) VALUES (?) RETURNING *");
    query.values.should.be.deep.equal([['data', '1', '2']]);
  });

  it.skip('insert::build() with array of json', function () {
    var insert = new Insert();
    var query = insert.build('table', {"array": [{"data": "stuff"}, {"data": 1}, {"stuff": false}]});
    query = query.toParam();

    query.text.should.be.equal("INSERT INTO table (array) VALUES (?) RETURNING *");
    query.values.should.be.deep.equal([[{"data": "stuff"}, {"data": 1},{"stuff": false}]]);
  });

  it('insert::build() empty records should fail', function () {
    var insert = new Insert();
    insert.build.bind(insert, 'table', {}).should.throw('Nothing to insert');
  });

  it('insert::build() non ascii column names will fail', function () {
    var insert = new Insert();
    insert.build.bind(insert, 'table', {'*(&':'value'}).should.throw('Malformed column name: *(&');
  });
});
