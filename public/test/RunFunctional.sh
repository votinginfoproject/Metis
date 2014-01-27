#! /usr/bin/env bash

# Drop the metic mongo DB
mongo metis --eval "db.dropDatabase()"

# Move to DB folder
cd ../../feed-processor/

#run processor.js
node processor.js ../public/test/Mocked\ DB/test_feed.xml

# Opens chrome and navigates to tests
open /Applications/Google\ Chrome.app "http://localhost:4000/test/e2e/runner.html"