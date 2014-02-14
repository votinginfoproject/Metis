/**
 * Created by rcartier13 on 2/13/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');

function localityCalc(feedId, saveCalc) {
 var localityOverview = [];
 schemas.models.Locality.find({ _feed: feedId })
   .populate('_earlyVoteSites')
   .populate('_electionAdministration')
   .populate('_precincts')
   .exec(function(err, localities) {

     async.each(localities, function(data, done) {
       var counter = 0;
       function wait() {
         if(++counter === 3)
           done();
       }

       var locality = data._doc;
       localityOverview.push({ section: locality.elementId });
       var overviewPos = localityOverview.length - 1;

       earlyVoteSiteCalc(locality._earlyVoteSites, function(amount, fieldCount, schemaFieldCount) {
         localityOverview[overviewPos].earlyVoteSites = {
           amount: amount,
           fieldCount: fieldCount,
           schemaFieldCount: schemaFieldCount
         }
         wait();
       });

       electionAdminCalc(locality._electionAdministration, function(amount, fieldCount, schemaFieldCount) {
         localityOverview[overviewPos].electionAdmin = {
           amount: amount,
           fieldCount: fieldCount,
           schemaFieldCount: schemaFieldCount
         }
         wait();
       });

       precinctsCalc(feedId, locality._precincts, function(precinct, split, pollingLoc, streetSeg) {
         localityOverview[overviewPos].precincts = precinct;
         localityOverview[overviewPos].precinctSplits = split;
         localityOverview[overviewPos].pollingLocations = pollingLoc;
         localityOverview[overviewPos].streetSegments = streetSeg;
         wait();
       });

     }, function(err) { saveCalc(localityOverview); });

   });
}

function earlyVoteSiteCalc(voteSites, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  voteSites.forEach(function(data) {
    var voteSite = data._doc;
    ++amount;
    fieldCount += Object.keys(voteSite).length - 4;
    schemaFieldCount += schemas.models.EarlyVoteSite.fieldCount;
    if(voteSite.address) {
      --fieldCount;
      fieldCount += Object.keys(voteSite.address).length;
    }
  });
  returnTotal(amount, fieldCount, schemaFieldCount);
}

function electionAdminCalc(data, returnTotal) {
  if(data === null)
    return returnTotal(0, 0, 0);

  var admin = data._doc;
  var amount = 1;
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
  returnTotal(amount, fieldCount, schemaFieldCount);
}

function precinctsCalc(feedId, precincts, returnTotal) {
  var precinct = { amount: 0, fieldCount: 0, schemaFieldCount: 0 };
  var split = { amount: 0, fieldCount: 0, schemaFieldCount: 0 };
  var pollingLoc = { amount: 0, fieldCount: 0, schemaFieldCount: 0 };
  var streetSeg = { amount: 0, fieldCount: 0, schemaFieldCount: 0 };

  async.each(precincts, function(data, done) {
    var precinct = data._doc;
    ++precinct.amount;
    precinct.fieldCount += Object.keys(precinct).length - 8;
    precinct.schemaFieldCount += schemas.models.Precinct.fieldCount;
    if(precinct.electoralDistrictIds)
      --precinct.fieldCount;
    if(precinct.pollingLocationIds)
      --precinct.fieldCount;
    if(precinct.earlyVoteSiteIds)
      --precinct.fieldCount;

    var count = 0;
    function wait() {
      if(++count == 3)
        done();
    }

    precinctSplitsCalc(feedId, precinct._precinctSplits, function(amount, fieldCount, schemaFieldCount) {
      split.amount += amount;
      split.fieldCount += fieldCount;
      split.schemaFieldCount += schemaFieldCount;
      wait();
    });

    pollingLocationCalc(feedId, precinct._pollingLocations, function(amount, fieldCount, schemaFieldCount) {
      pollingLoc.amount = amount;
      pollingLoc.fieldCount = fieldCount;
      pollingLoc.schemaFieldCount = schemaFieldCount;
      wait();
    });

    streetSegmentsCalc(feedId, precinct._streetSegments, function(amount, fieldCount, schemaFieldCount) {
      streetSeg.amount = amount;
      streetSeg.fieldCount = fieldCount;
      streetSeg.schemaFieldCount = schemaFieldCount;
      wait();
    });

  }, function(err) { returnTotal(precinct, split, pollingLoc, streetSeg); });
}

function precinctSplitsCalc(feedId, splits, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  async.each(splits, function(splitId, done) {
    schemas.models.PrecinctSplit.find( { _feed: feedId, _id: splitId } )
      .exec(function(err, data) {
        var split = data[0]._doc;
        ++amount;
        fieldCount += Object.keys(split).length - 7;
        schemaFieldCount += schemas.models.PrecinctSplit.fieldCount;
        if(split.electoralDistrictIds)
          --fieldCount;
        if(split.pollingLocationIds)
          --fieldCount;
        done();
      });
  }, function(err) { returnTotal(amount, fieldCount, schemaFieldCount); })
}

function pollingLocationCalc(feedId, locations, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  async.each(locations, function(locId, done) {
    schemas.models.PollingLocation.find( { _feed: feedId, _id: locId })
      .exec(function(err, data) {
        var location = data[0]._doc;
        ++amount;
        fieldCount += Object.keys(location).length - 5;
        schemaFieldCount += schemas.models.PollingLocation.fieldCount;
        if(location.address) {
          --fieldCount;
          fieldCount += Object.keys(location.address).length;
        }
        done();
      });
  }, function(err) { returnTotal(amount, fieldCount, schemaFieldCount); });
}

function streetSegmentsCalc(feedId, segments, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  async.each(segments, function(segId, done) {
    schemas.models.StreetSegment.find({ _feed: feedId, _id: segId })
      .exec(function(err, data) {
        var segment = data[0]._doc;
        ++amount;
        fieldCount += Object.keys(segment).length - 3;
        schemaFieldCount += schemas.models.StreetSegment.fieldCount;
        if(segment.nonHouseAddress) {
          --fieldCount;
          fieldCount += Object.keys(segment.nonHouseAddress).length;
        }
        done();
      });
  }, function(err) { returnTotal(amount, fieldCount, schemaFieldCount); })
}

exports.localityCalc = localityCalc;