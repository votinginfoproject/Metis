/**
 * Created by rcartier13 on 12/28/13.
 */

var failedCount = 0;
var total = 0;
var ballots, ballotResponse, ballotLineResponse;

//app configuration
var config = require('../../../config');

//database setup
var mongoose = require('mongoose');
var daoSchemas = require('../../../dao/schemas');

mongoose.connect(config.mongoose.testConnectionString);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("Initializing Mongoose...")
  daoSchemas.initSchemas(config, mongoose);
  saveSchemas(daoSchemas.models);
  console.log("Initialized Mongoose for VIP database.");

  console.log("Testing Schemas: ");
  runTests(daoSchemas.models, function() {
    console.log((total-failedCount) + " of " + total + " passed.");
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
  }
  total++;
};

function saveSchemas(models) {
  ballots = new models.Ballot({
    elementId: 1,
    referendumId: 2,
    candidates: [{id: 3, sortOrder: 0}, {id:4, sortOrder: 1}],
    customBallotID: 5,
    writeIn: false,
    imageUrl: 'FakeUrl.edu'
  });
  ballots.save();

  ballotResponse = new models.BallotResponse({
    elementId: 1,
    test: 'something',
    sortOrder: 2
  });
  ballotResponse.save();

  ballotLineResponse = new models.BallotLineResult({
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
  ballotLineResponse.save();
};

function runTests(models, cb) {
  var isPassing;
  models.Ballot.find({}, function(err, foundVal) {
    isPassing = true;
    if(err || foundVal[0].elementId !== ballots.elementId)
      isPassing = false;
    acquire('Ballot Schema Test', isPassing);
  });

  models.BallotResponse.find({}, function(err, foundVal) {
    isPassing = true;
    if(err || foundVal[0].elementId !== ballotResponse.elementId)
      isPassing = false;
    acquire('Ballot Response Schema Test', isPassing);
  });

  models.BallotLineResult.find({}, function(err, foundVal) {
    isPassing = true;
    if(err || foundVal[0].elementId !== ballotLineResponse.elementId)
      isPassing = false;
    acquire('Ballot Line Result Schema Test', isPassing);
    cb();
  });
};



