"use strict";

var QueryBuilder = manati_test_require('lib/builder/query.js');

describe('QueryBuilder.builOperation()', function () {
  it('builOperation() with unknown operator', function() {
    QueryBuilder.buildOperation.bind(QueryBuilder, 'name', 'dasmdjaskj', '12').should.throw(Error, 'Unknown operator dasmdjaskj');
  });

  it('builOperation() regular case', function () {
    var operation = QueryBuilder.buildOperation('name', 'eq', '12');

    operation.should.have.property('operation');
    operation.should.have.property('value');
    operation['operation'].should.be.eq('name = ?');
    operation['value'].should.be.eq('12');
  });

  it('builOperation() test operators', function () {
    QueryBuilder.buildOperation('name', 'eq', '12').operation.should.eq('name = ?', 'eq parameter');
    QueryBuilder.buildOperation('name', 'gt', '12').operation.should.eq('name > ?', 'gt parameter');
    QueryBuilder.buildOperation('name', 'gte', '12').operation.should.eq('name >= ?', 'gte parameter');
    QueryBuilder.buildOperation('name', 'lt', '12').operation.should.eq('name < ?');
    QueryBuilder.buildOperation('name', 'lte', '12').operation.should.eq('name <= ?');
    QueryBuilder.buildOperation('name', 'like', '12').operation.should.eq('name LIKE ?');
    QueryBuilder.buildOperation('name', 'ilike', '12').operation.should.eq('name ILIKE ?');
    QueryBuilder.buildOperation('name', 'is_contained_by', '12').operation.should.eq('name <@ ?');
    QueryBuilder.buildOperation('name', 'parent', '12').operation.should.eq('name <@ ?');
    QueryBuilder.buildOperation('name', 'child', '12').operation.should.eq('name @> ?');
    QueryBuilder.buildOperation('name', 'contains', '12').operation.should.eq('name @> ?');

    var gis_dwithin = QueryBuilder.buildOperation('place', 'gis_dwithin', '10,50,100');
    gis_dwithin.operation.toString().should.eq("ST_DWithin(place,'POINT(10.00000 50.00000)',?)");
    gis_dwithin.value.should.be.eq(100);

    var gis_dwithin = QueryBuilder.buildOperation('place', 'gis_dwithin', '10.123456789,50.987654321,100');
    gis_dwithin.operation.toString().should.eq("ST_DWithin(place,'POINT(10.12346 50.98765)',?)");
    gis_dwithin.value.should.be.eq(100);
  });
});

describe('QueryBuilder.buildWhereExpression()', function () {
  it('buildWhereExpression() with no operator', function () {
    QueryBuilder.buildWhereExpression(['name'], {'name': 'toto'}).toString().should.be.eq("name = 'toto'");
  });

  it('buildWhereExpression() with operator', function () {
    QueryBuilder.buildWhereExpression(['name'], {'name': 'eq::toto'}).toString().should.be.eq("name = 'toto'");
    QueryBuilder.buildWhereExpression(['name'], {'name': 'gt::toto'}).toString().should.be.eq("name > 'toto'");
  });
});
