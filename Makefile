.PHONY: test unit integration

MOCHA=node_modules/.bin/mocha
REPORTER = spec

test: unit integration

unit:
	NODE_ENV=testing $(MOCHA) --require test/unit/bootstrap.js --reporter $(REPORTER) test/unit/lib/*.js

integration:
	NODE_ENV=testing DATABASE_URL=postgres://travis_ci_user@localhost:5432/travis_ci_db \
	$(MOCHA) --require test/integration/bootstrap.js --reporter $(REPORTER) test/integration/data/*.js
