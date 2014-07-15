#! /usr/bin/env bash

# Drop the metic mongo DB
mongo metis --eval "db.dropDatabase()"

# Install counties and fips
mongoimport -d metis -c counties < data/counties.json
mongoimport -d metis -c statefips < data/statefips.json

# Move to DB folder
cd feed-processor/

#run processor.js
node processor.js ../upload/OH_test_feed.xml

# Run the overview process
node overview/overview-processor.js

echo "*******************"
echo "open browser to: http://localhost:4000/test/e2e/runner.html"
echo "*******************"
# Run the webapp
cd -
node app.js
