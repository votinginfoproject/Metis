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

       var localityCount = 0;
       function wait() {
         if(++localityCount === 3)
          done();
       }

       localityOverview[overviewPos].earlyVoteSites = util.reduceOverviewObject(locality._earlyVoteSites, schemas.models.EarlyVoteSite.fieldCount);
       schemas.models.EarlyVoteSite.Error.count({ _ref: {$in: locality._earlyVoteSites} }, function(err, count) {
         localityOverview[overviewPos].earlyVoteSites.errorCount = count;
         wait();
       });

       var adminCount = locality._electionAdministration ? util.countProperties(locality._electionAdministration) : 0;
       localityOverview[overviewPos].electionAdmin = util.createOverviewObject(adminCount ? 1 : 0, adminCount, schemas.models.ElectionAdmin.fieldCount);
       schemas.models.ElectionAdmin.Error.count({ _ref: locality._electionAdministration }, function(err, count) {
         localityOverview[overviewPos].electionAdmin.errorCount = count;
         wait();
       });


       precinctsCalc(feedId, locality._precincts, function(precinct, split, pollingLoc, streetSeg) {
         localityOverview[overviewPos].precincts = precinct;
         localityOverview[overviewPos].precinctSplits = split;
         localityOverview[overviewPos].pollingLocations = pollingLoc;
         localityOverview[overviewPos].streetSegments = streetSeg;

         schemas.models.Precinct.Error.count({ _ref: {$in: locality._precincts} }, function(err, count) {
           localityOverview[overviewPos].precincts.errorCount = count;
           wait();
         });
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

    util.findOverviewObject(feedId, precinct._precinctSplits, schemas.models.PrecinctSplit, function(res) {
      splitOverview = util.addOverviewObjects(splitOverview, res);
      schemas.models.PrecinctSplit.Error.count({ _ref: {$in: precinct._precinctSplits} }, function(err, count) {
        splitOverview.errorCount += count;
        wait();
      });
    });
    util.findOverviewObject(feedId, precinct._pollingLocations, schemas.models.PollingLocation, function(res) {
      pollingLocOverview = util.addOverviewObjects(pollingLocOverview, res);
      schemas.models.PollingLocation.Error.count({ _ref: {$in: precinct._pollingLocations} }, function(err, count) {
        pollingLocOverview.errorCount += count;
        wait();
      });
    });
    util.findOverviewObject(feedId, precinct._streetSegments, schemas.models.StreetSegment, function(res) {
      streetSegOverview = util.addOverviewObjects(streetSegOverview, res);
      schemas.models.StreetSegment.Error.count({ _ref: {$in: precinct._streetSegments} }, function(err, count) {
        streetSegOverview.errorCount += count;
        wait();
      });
    });

  }, function(err) { returnTotal(precinctOverview, splitOverview, pollingLocOverview, streetSegOverview); });
}

exports.localityCalc = localityCalc;