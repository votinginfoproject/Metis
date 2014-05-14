/**
 * Created by rcartier13 on 2/13/14.
 */

var logger = (require('../../logging/vip-winston')).Logger;
var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');
var _ = require('underscore');

function kickoffLocality(feedId, createOverviewModel, wait) {
  logger.info('=======================================');
  logger.info('Starting Single Locality Calc...');
  localityCalc(feedId, function(localityOverview) {
    logger.info('Finished Single Locality');
    logger.info('=======================================');
    localityOverview.forEach(function(overview) {
      createOverviewModel('Early Vote Sites', overview.earlyVoteSites, overview.earlyVoteSites.errorCount, overview.section, feedId);
      createOverviewModel('Election Administration', overview.electionAdmin, overview.electionAdmin.errorCount, overview.section, feedId);
      createOverviewModel('Precincts', overview.precincts, overview.precincts.errorCount, overview.section, feedId);
      createOverviewModel('Precinct Splits', overview.precinctSplits, overview.precinctSplits.errorCount, overview.section, feedId);
      createOverviewModel('Polling Locations', overview.pollingLocations, overview.pollingLocations.errorCount, overview.section, feedId);
      createOverviewModel('Street Segments', overview.streetSegments, overview.streetSegments.errorCount, overview.section, feedId);
    });
    wait();
  });
}

function localityCalc(feedId, saveCalc) {
 var localityOverview = [];
 schemas.models.localitys.find({ _feed: feedId })
   .populate('_earlyVoteSites')
   .populate('_electionAdministration')
   .populate('_precincts')
   .exec(function(err, localities) {

     async.eachSeries(localities, function(data, done) {
       var locality = data._doc;
       localityOverview.push({ section: locality.elementId });
       var overviewPos = localityOverview.length - 1;

       var localityCount = 0;
       function wait() {
         if(++localityCount === 3)
          done();
       }

       localityOverview[overviewPos].earlyVoteSites = util.reduceOverviewObject(locality._earlyVoteSites, schemas.models.earlyvotesites.fieldCount);
       schemas.models.earlyvotesites.Error.count({ _ref: {$in: locality._earlyVoteSites} }, function(err, count) {
         localityOverview[overviewPos].earlyVoteSites.errorCount = count;
         wait();
       });

       var adminCount = locality._electionAdministration ? util.countProperties(locality._electionAdministration) : 0;
       if(adminCount) {
         localityOverview[overviewPos].electionAdmin = util.createOverviewObject(1, adminCount, schemas.models.electionadmins.fieldCount);
       }
       else {
         localityOverview[overviewPos].electionAdmin = util.createOverviewObject();
       }
       schemas.models.electionadmins.Error.count({ _ref: locality._electionAdministration }, function(err, count) {
         localityOverview[overviewPos].electionAdmin.errorCount = count;
         wait();
       });

       precinctsCalc(feedId, locality._precincts, function(precinct, split, pollingLoc, streetSeg) {

         localityOverview[overviewPos].precincts = precinct;
         localityOverview[overviewPos].precinctSplits = split;
         localityOverview[overviewPos].pollingLocations = pollingLoc;
         localityOverview[overviewPos].streetSegments = streetSeg;

         schemas.models.precincts.Error.count({ _ref: {$in: locality._precincts} }, function(err, count) {
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

  // will be keeping track of all the Polling Locations we process
  var countedPollingLocations = [];

  async.eachSeries(precincts, function(data, done) {
    var precinct = data._doc;

    ++precinctOverview.amount;
    precinctOverview.fieldCount += util.countProperties(precinct);
    precinctOverview.schemaFieldCount += schemas.models.precincts.fieldCount;

    var paramList = [];

    paramList.push(util.createParamList(feedId, precinct._precinctSplits, schemas.models.precinctsplits, function(res, cb) {
      splitOverview = util.addOverviewObjects(splitOverview, res);
      schemas.models.precinctsplits.Error.count({ _ref: {$in: precinct._precinctSplits} }, function(err, count) {
        splitOverview.errorCount += count;
        cb();
      });
    }));

    paramList.push(util.createParamList(feedId, precinct._pollingLocations, schemas.models.pollinglocations, function(res, cb) {

      pollingLocOverview = util.addOverviewObjects(pollingLocOverview, res);

      // for the error counts, since the same Polling Location can be in different Precincts, don't count the
      // the same Polling Location in regards to the error count
      var pollingLocationsToQuery = [];
      for(var i=0; i < precinct._pollingLocations.length; i++){
        if(countedPollingLocations[precinct._pollingLocations[i]]===undefined){
          // flagging the fact that we are processing this polling location
          countedPollingLocations[precinct._pollingLocations[i]] = true;

          // this is what we will query against
          pollingLocationsToQuery.push(precinct._pollingLocations[i]);
        }
      }

      schemas.models.pollinglocations.Error.count({ _ref: {$in: pollingLocationsToQuery} }, function(err, count) {
        pollingLocOverview.errorCount += count;
        cb();
      });
    }));

    paramList.push(util.createParamList(feedId, precinct._streetSegments, schemas.models.streetsegments, function(res, cb) {
      streetSegOverview = util.addOverviewObjects(streetSegOverview, res);

      // we only have to count the street segments under the precinct, as the street segments under
      // a precinct are the aggregate of street segments under its precinct splits (if any)
      schemas.models.streetsegments.Error.count({ _ref: {$in: precinct._streetSegments} }, function(err, count) {
        streetSegOverview.errorCount += count;
        cb();
      });

      // capture the street segments that are under the precinct, and all of its precinct splits
      /*
      var streetsegments = [];
      streetsegments = streetsegments.concat(precinct._streetSegments);

      var precinctsplitsPromise = schemas.models.PrecinctSplit.find({ _feed: feedId, _id: {$in: precinct._precinctSplits} }, {_streetSegments: 1}).exec();
      precinctsplitsPromise.then(function (precinctsplits) {

        precinctsplits.forEach( function(precinctsplit){
          // capture the street segments on the Precinct Splits level
          precinctsplit._streetSegments.forEach( function(streetsegment){
            streetsegments.push(streetsegment);
          });

        });

        // now count errors from all street segments under precincts and precinct splits
       schemas.models.StreetSegment.Error.count({ _ref: {$in: streetsegments} }, function(err, count) {
       streetSegOverview.errorCount += count;
       cb();
       });

      });
      */

    }));

    async.eachSeries(paramList, function(params, complete) {
      var stream = util.streamOverviewObject(params);
      var overview = util.createOverviewObject();
      stream.on('data', function(doc) {
        overview.amount++;
        overview.fieldCount += util.countProperties(doc);
        overview.schemaFieldCount += params.model.fieldCount;
      });

      stream.on('end', function(err) {
        params.returnTotal(overview, complete);
      });

    }, function() { done(); });

  }, function(err) { returnTotal(precinctOverview, splitOverview, pollingLocOverview, streetSegOverview); });
}

exports.kickoffLocality = kickoffLocality;
exports.localityCalc = localityCalc;