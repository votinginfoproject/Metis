/**
 * Created by rcartier13 on 12/28/13.
 */

var failedCount = 0;
var total = 20;
var savedData = [];

//app configuration
var config = require('../../../config');

//database setup
var mongoose = require('mongoose');
var daoSchemas = require('../../../dao/schemas');
var tests = require('./tests');
var mockedModels = require('./mockedModels');


mongoose.connect(config.mongoose.testConnectionString);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("Initializing Mongoose...")
  daoSchemas.initSchemas(mongoose);
  saveSchemas(daoSchemas.models, function() {
    console.log("Initialized Mongoose for VIP database.");

    console.log("Testing Schemas: ");
    runTests(daoSchemas.models, function() {
      console.log(total - failedCount + " out of " + total + " passed!");
      mongoose.disconnect();
    });
  });
});

// Prints whether the test passed or failed and logs the total
function acquire(description, ifPassed) {
  if(!ifPassed) {
    console.log(description + " test failed!");
    failedCount++;
  } else {
    console.log(description + " test Passed!");
  };
};

function saveSchemas(models, callback) {

  var count = 0;
  function countUp() {
    count++;
    if(count === total)
      callback();
  };

  savedData['ballots'] = new models.Ballot(mockedModels.ballots);
  savedData['ballots'].save(countUp);

  savedData['ballotResponse'] = new models.BallotResponse(mockedModels.ballotResponse);
  savedData['ballotResponse'].save(countUp);

  savedData['ballotLineResult'] = new models.BallotLineResult(mockedModels.ballotLineResult);
  savedData['ballotLineResult'].save(countUp);

  savedData['candidate'] = new models.Candidate(mockedModels.candidate);
  savedData['candidate'].save(countUp);

  savedData['contest'] = new models.Contest(mockedModels.contest);
  savedData['contest'].save(countUp);

  savedData['contestResult'] = new models.ContestResult(mockedModels.contestResult);
  savedData['contestResult'].save(countUp);

  savedData['customBallot'] = new models.CustomBallot(mockedModels.customBallot);
  savedData['customBallot'].save(countUp);

  savedData['earlyVoteSite'] = new models.EarlyVoteSite(mockedModels.earlyVoteSite);
  savedData['earlyVoteSite'].save(countUp);

  savedData['election'] = new models.Election(mockedModels.election);
  savedData['election'].save(countUp);

  savedData['electionAdmin'] = new models.ElectionAdmin(mockedModels.electionAdmin);
  savedData['electionAdmin'].save(countUp);

  savedData['electionOfficial'] = new models.ElectionOfficial(mockedModels.electionOfficial);
  savedData['electionOfficial'].save(countUp);

//  TODO figure out why electoral district isnt saving properly.
//  savedData['electoralDistrict'] = new models.ElectoralDistrict(mockedModels.electoralDistrict);
//  savedData['electoralDistrict'].save(countUp);

  savedData['feed'] = new models.Feed(mockedModels.feed);
  savedData['feed'].save(countUp);

  savedData['locality'] = new models.Locality(mockedModels.locality);
  savedData['locality'].save(countUp);

  savedData['pollingLocation'] = new models.PollingLocation(mockedModels.pollingLocation);
  savedData['pollingLocation'].save(countUp);

  savedData['precinct'] = new models.Precinct(mockedModels.precinct);
  savedData['precinct'].save(countUp);

  savedData['precinctSplit'] = new models.PrecinctSplit(mockedModels.precinctSplit);
  savedData['precinctSplit'].save(countUp);

  savedData['referendum'] = new models.Referendum(mockedModels.referendum);
  savedData['referendum'].save(countUp);

  savedData['source'] = new models.Source(mockedModels.source);
  savedData['source'].save(countUp);

  savedData['state'] = new models.State(mockedModels.state);
  savedData['state'].save(countUp);

  savedData['streetSegment'] = new models.StreetSegment(mockedModels.streetSegment);
  savedData['streetSegment'].save(countUp);
};

function runTests(models, callback) {



  var count = 0;
  function countUp(description, isPassing) {
    acquire(description, isPassing);
    ++count;
    if(count === total)
      callback();
  };

  tests.ballotTest(models, savedData['ballots'], countUp);
  tests.ballotResponseTest(models, savedData['ballotResponse'], countUp);
  tests.ballotLineResultTest(models, savedData['ballotLineResult'], countUp);
  tests.candidateTest(models, savedData['candidate'], countUp);
  tests.contestTest(models, savedData['contest'], countUp);
  tests.contestResultTest(models, savedData['contestResult'], countUp);
  tests.customBallotTest(models, savedData['customBallot'], countUp);
  tests.earlyVoteSiteTest(models, savedData['earlyVoteSite'], countUp);
  tests.electionTest(models, savedData['election'], countUp);
  tests.electionAdminTest(models, savedData['electionAdmin'], countUp);
  tests.electionOfficialTest(models, savedData['electionOfficial'], countUp);
  //tests.electoralDistrictTest(models, savedData['electoralDistrict'], countUp);
  tests.feedTest(models, savedData['feed'], countUp);
  tests.localityTest(models, savedData['locality'], countUp);
  tests.pollingLocationTest(models, savedData['pollingLocation'], countUp);
  tests.precinctTest(models, savedData['precinct'], countUp);
  tests.precinctSplitTest(models, savedData['precinctSplit'], countUp);
  tests.referendumTest(models, savedData['referendum'], countUp);
  tests.sourceTest(models, savedData['source'], countUp);
  tests.stateTest(models, savedData['state'], countUp);
  tests.streetSegmentTest(models, savedData['streetSegment'], countUp);
};



