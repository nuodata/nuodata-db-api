"use strict";

var operators = manati_test_require('lib/builder/operators/reqular.js');

describe('operators regular', function () {
  it('multiple operators', function () {
    operators.regular.eq('name', 'toto').should.eq('name = ?');
    operators.regular.gt('name', 'toto').should.eq('name > ?');
    operators.regular.gte('name', 'toto').should.eq('name >= ?');
    operators.regular.lt('name', 'toto').should.eq('name < ?');
    operators.regular.lte('name', 'toto').should.eq('name <= ?');
    operators.regular.like('name', 'toto').should.eq('name like ?');
    operators.regular.ilike('name', 'toto').should.eq('name ilike ?');
  });
});