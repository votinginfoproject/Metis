#! /usr/bin/env bash

# Drop the metic mongo DB
mongo metis --eval "db.dropDatabase()"

# Move to DB folder
cd ./Mocked\ DB/

# Added New collections
mongoimport --db metis --collection ballotlineresults --file ballotlineresults.json

mongoimport --db metis --collection ballotresponses --file ballotresponses.json

mongoimport --db metis --collection ballots --file ballots.json

mongoimport --db metis --collection candidates --file candidates.json

mongoimport --db metis --collection contestresults --file contestresults.json

mongoimport --db metis --collection contests --file contests.json

mongoimport --db metis --collection customballots --file customballots.json

mongoimport --db metis --collection earlyvotesites --file earlyvotesites.json

mongoimport --db metis --collection electionadministrations --file electionadministrations.json

mongoimport --db metis --collection electionofficials --file electionofficials.json

mongoimport --db metis --collection elections --file elections.json

mongoimport --db metis --collection electoraldistricts --file electoraldistricts.json

mongoimport --db metis --collection feeds --file feeds.json

mongoimport --db metis --collection localitys --file localitys.json

mongoimport --db metis --collection pollinglocations --file pollinglocations.json

mongoimport --db metis --collection precincts --file precincts.json

mongoimport --db metis --collection precinctsplits --file precinctsplits.json

mongoimport --db metis --collection referendums --file referendums.json

mongoimport --db metis --collection sources --file sources.json

mongoimport --db metis --collection states --file states.json

mongoimport --db metis --collection streetsegments --file streetsegments.json

mongoimport --db metis --collection violations --file violations.json

# Opens chrome and navigates to tests
open /Applications/Google\ Chrome.app "http://localhost:4000/test/e2e/runner.html"