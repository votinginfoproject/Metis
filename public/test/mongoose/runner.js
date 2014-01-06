/**
 * Created by rcartier13 on 12/28/13.
 */

var failedCount = 0;
var total = 4;
var savedData = [];

//app configuration
var config = require('../../../config');

//database setup
var mongoose = require('mongoose');
var daoSchemas = require('../../../dao/schemas');
var tests = require('./tests');


mongoose.connect(config.mongoose.testConnectionString);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("Initializing Mongoose...")
  daoSchemas.initSchemas(mongoose);
  saveSchemas(daoSchemas.models);
  console.log("Initialized Mongoose for VIP database.");

  console.log("Testing Schemas: ");
  runTests(daoSchemas.models, function() {
    console.log(total - failedCount + " out of " + total + " passed!");
    mongoose.disconnect();
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

function saveSchemas(models) {
  savedData['ballots'] = new models.Ballot({
    elementId: 1,
    referendumId: 2,
    candidates: [{id: 3, sortOrder: 0}, {id:4, sortOrder: 1}],
    customBallotID: 5,
    writeIn: false,
    imageUrl: 'FakeUrl.edu'
  });

  savedData['ballots'].save();

  savedData['ballotResponse'] = new models.BallotResponse({
    elementId: 1,
    test: 'something',
    sortOrder: 2
  });

  savedData['ballotResponse'].save();

  savedData['ballotLineResponse'] = new models.BallotLineResult({
    elementId: 1, //required
    contestId: 2,
    jurisdictionId: 3,
    entireDistrict: true,
    candidateId: 4,
    ballotResponseId: 5,
    votes: 6,
    victorious: false,
    certification: 'something'
  });

  savedData['ballotLineResponse'].save();

  var simpleAddress = {
    locationName: 'Place',
    line1: 'blah',
    line2: '',
    line3: '',
    city: 'Reston',
    state: 'VA',
    zip: '20202'
  };

  savedData['candidate'] = new models.Candidate({
    elementId: 1, //required
    name: 'something',
    party: 'Tea',
    candidateUrl: 'www.awesome.com',
    biography: 'is a person',
    phone: '555-555-5555',
    photoUrl: 'www.imgur.com',
    filedMailingAddress: simpleAddress,
    email: 'booyah@yahoo',
    sortOrder: 2
  });

  savedData['candidate'].save();
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
  tests.ballotLineResult(models, savedData['ballotLineResponse'], countUp);
  tests.candidate(models, savedData['candidate'], countUp);
};



