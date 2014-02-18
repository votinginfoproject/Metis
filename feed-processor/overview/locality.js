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

       localityOverview[overviewPos].earlyVoteSites = util.reduceOverviewObject(locality._earlyVoteSites, schemas.models.EarlyVoteSite.fieldCount);

       var adminCount = locality._electionAdministration ? util.countProperties(locality._electionAdministration) : 0;
       localityOverview[overviewPos].electionAdmin = util.createOverviewObject(adminCount ? 1 : 0, adminCount, schemas.models.ElectionAdmin.fieldCount);

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

function precinctsCalc(feedId, precincts, returnTotal) {
  var precinctOverview = util.createOverviewObject();
  var splitOverview = util.createOverviewObject();
  var pollingLocOverview = util.createOverviewObject();
  var streetSegOverview = util.createOverviewObject();

  async.each(precincts, function(data, done) {
    var precinct = data._doc;
    ++precinctOverview.amount;
    precinctOverview.fieldCount += util.countProperties(precinct);
    precinctOverview.schemaFieldCount += schemas.models.Precinct.fieldCount;

    var count = 0;
    function wait() {
      if(++count == 3)
        done();
    }

    util.findOverviewObject(feedId, precinct._precinctSplits, schemas.models.PrecinctSplit, function(res) { util.addOverviewObjects(splitOverview, res); wait(); });
    util.findOverviewObject(feedId, precinct._pollingLocations, schemas.models.PollingLocation, function(res) { util.addOverviewObjects(pollingLocOverview, res); wait(); });
    util.findOverviewObject(feedId, precinct._streetSegments, schemas.models.StreetSegment, function(res) { util.addOverviewObjects(streetSegOverview, res); wait(); });

  }, function(err) { returnTotal(precinctOverview, splitOverview, pollingLocOverview, streetSegOverview); });
}

exports.localityCalc = localityCalc;