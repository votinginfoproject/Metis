/**
 * Created by rcartier13 on 2/13/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');
var _ = require('underscore');

function localityCalc(feedId, saveCalc) {
 var localityOverview = [];
 schemas.models.Locality.find({ _feed: feedId })
   .populate('_earlyVoteSites')
   .populate('_electionAdministration')
   .populate('_precincts')
   .exec(function(err, localities) {

     async.each(localities, function(data, done) {
       var locality = data._doc;
       localityOverview.push({ section: locality.elementId });
       var overviewPos = localityOverview.length - 1;

       localityOverview[overviewPos].earlyVoteSites = earlyVoteSiteCalc(locality._earlyVoteSites, util.createOverviewObject());
       localityOverview[overviewPos].electionAdmin = electionAdminCalc(locality._electionAdministration);

       precinctsCalc(feedId, locality._precincts, function(precinct, split, pollingLoc, streetSeg) {
         localityOverview[overviewPos].precincts = precinct;
         localityOverview[overviewPos].precinctSplits = split;
         localityOverview[overviewPos].pollingLocations = pollingLoc;
         localityOverview[overviewPos].streetSegments = streetSeg;
         done();
       });

     }, function(err) { saveCalc(localityOverview); });

   });
}

function earlyVoteSiteCalc(voteSites, initial) {
  return voteSites.reduce(function(memo, current) {
    memo.amount++;
    memo.fieldCount += Object.keys(current._doc).length - 4;
    memo.schemaFieldCount += schemas.models.EarlyVoteSite.fieldCount;
    if (current.address) {
      memo.fieldCount += Object.keys(current._doc.address).length - 1;
    }
    return memo;
  }, initial);
}

function electionAdminCalc(data) {
  if(data === null)
    return util.createOverviewObject(0, 0, 0);

  var admin = data._doc;
  var fieldCount = Object.keys(admin).length - 5;
  var schemaFieldCount = schemas.models.ElectionAdmin.fieldCount;
  if(admin.mailingAddress) {
    --fieldCount;
    fieldCount += Object.keys(admin.mailingAddress).length;
  }
  if(admin.physicalAddress) {
    --fieldCount;
    fieldCount += Object.keys(admin.physicalAddress).length;
  }

  return util.createOverviewObject(1, fieldCount, schemaFieldCount);
}

function precinctsCalc(feedId, precincts, returnTotal) {
  var precinctOverview = util.createOverviewObject();
  var splitOverview = util.createOverviewObject();
  var pollingLocOverview = util.createOverviewObject();
  var streetSegOverview = util.createOverviewObject();

  async.each(precincts, function(data, done) {
    var precinct = data._doc;
    ++precinctOverview.amount;
    precinctOverview.fieldCount += Object.keys(precinct).length - 8;
    precinctOverview.schemaFieldCount += schemas.models.Precinct.fieldCount;

    var count = 0;
    function wait() {
      if(++count == 3)
        done();
    }

    precinctSplitsCalc(feedId, precinct._precinctSplits, function(res) { util.addOverviewObjects(splitOverview, res); wait(); });
    pollingLocationCalc(feedId, precinct._pollingLocations, function(res) { util.addOverviewObjects(pollingLocOverview, res); wait(); });
    streetSegmentsCalc(feedId, precinct._streetSegments, function(res) { util.addOverviewObjects(streetSegOverview, res); wait(); });

  }, function(err) { returnTotal(precinctOverview, splitOverview, pollingLocOverview, streetSegOverview); });
}

function precinctSplitsCalc(feedId, splits, returnTotal) {
  schemas.models.PrecinctSplit.find( { _feed: feedId, _id: { $in: splits } }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 7;
      memo.schemaFieldCount += schemas.models.PrecinctSplit.fieldCount;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function pollingLocationCalc(feedId, locations, returnTotal) {
  schemas.models.PollingLocation.find( { _feed: feedId, _id: { $in: locations } }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 5;
      memo.schemaFieldCount += schemas.models.PollingLocation.fieldCount;
      if(current._doc.address) {
        memo.fieldCount += Object.keys(current._doc.address).length - 1;
      }
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function streetSegmentsCalc(feedId, segments, returnTotal) {
  schemas.models.StreetSegment.find({ _feed: feedId, _id: { $in: segments } }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 3;
      memo.schemaFieldCount += schemas.models.StreetSegment.fieldCount;
      if(current.nonHouseAddress) {
        memo.schemaFieldCount += Object.keys(current.nonHouseAddress).length - 1;
      }
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

exports.localityCalc = localityCalc;