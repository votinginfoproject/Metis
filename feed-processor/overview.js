/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../config');
var mongoose = require('mongoose');
var schemas = require('../dao/schemas');

var overviewData = [];

mongoose.connect(config.mongoose.connectionString);
console.log("initialized VIP database via Mongoose");
schemas.initSchemas(mongoose);
countUp(function() {
  console.log('Finished Counting');
  var count = 0;
  var wait = function() {
    if(++count === 6)
      mongoose.disconnect();
  };

  for(var i = 0; i < overviewData.length; i++) {
    console.log('Saving ' + overviewData[i].type + ' Overview');
    createModel(overviewData[i]).save(wait);
  }
});

function countUp(callback) {
  var wait = function() {
    if(overviewData.length === 6)
      callback();
  };

  schemas.models.Feed.find({}, { payload: 0 })
    .populate('_id')
    .exec(runCounts);

  function runCounts(err, data) {
    var feedId = data[0]._id;
    if(err)
      console.log('Feed not found');

    console.log(feedId);
    PollingLocations(feedId, wait);
    Contests(feedId, wait);
  };
};

function PollingLocations(feedId, callback) {
  schemas.models.Locality.count({_feed: feedId}, function(err, count) {
    overviewData[overviewData.length] = fillOutData('Locality', count, 0, 0, 101);
    callback();
  });

  schemas.models.Precinct.count({_feed: feedId}, function(err, count) {
    overviewData[overviewData.length] = fillOutData('Precinct', count, 0, 0, 101);
    callback();
  });

  schemas.models.ElectoralDistrict.count({_feed: feedId}, function(err, count) {
    overviewData[overviewData.length] = fillOutData('Electoral', count, 0, 0, 101);
    callback();
  });
};

function Contests(feedId, callback) {
  schemas.models.Contest.count({_feed: feedId}, function(err, count) {
    overviewData[overviewData.length] = fillOutData('Contest', count, 0, 0, 102);
    callback();
  });

  schemas.models.Ballot.count({_feed: feedId}, function(err, count) {
    overviewData[overviewData.length] = fillOutData('Ballot', count, 0, 0, 102);
    callback();
  });

  schemas.models.Candidate.count({_feed: feedId}, function(err, count) {
    overviewData[overviewData.length] = fillOutData('Candidate', count, 0, 0, 102);
    callback();
  });
}

function createModel(data) {
  return new schemas.models.Overview({
    element_type: data.type,
    amount: data.count,
    complete_pct: data.complete,
    error_count: data.error,
    section: data.section
  });
};

function fillOutData(type, count, complete, error, section) {
  return {
    type: type,
    count: count,
    complete: complete,
    error: error,
    section: section
  }
}