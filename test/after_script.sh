#!/bin/sh

psql -c 'drop database travis_ci_db;' -U $PGUSER
psql -c 'drop user travis_ci_user; ' -U $PGUSER
