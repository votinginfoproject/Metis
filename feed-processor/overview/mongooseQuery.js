/**
 * Created by rcartier13 on 2/6/14.
 */

var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');

function pollingLocations(feedId, callback, overviewData) {
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

function contests(feedId, callback, overviewData) {
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
};

function fillOutData(type, count, complete, error, section) {
  return {
    type: type,
    count: count,
    complete: complete,
    error: error,
    section: section
  }
};

exports.pollingLocations = pollingLocations;
exports.contests = contests;