#! /usr/bin/env bash

# change the database
export DB_ENV_POSTGRES_DATABASE="data-dashboard-test"

# recreate pg database
dropdb data-dashboard-test
createdb data-dashboard-test

# import database based off of upload file
psql data-dashboard-test < pg-setup/database-setup.sql

echo "*******************"
echo "open browser to: http://localhost:4000/test/e2e/runner.html"
echo "close this window or reset your env variables after finishing"
echo "*******************"

# Run the webapp
node app.js