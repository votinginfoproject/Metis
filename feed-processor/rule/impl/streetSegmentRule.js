/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var when = require('when');

var Violation = require('../ruleviolation');

var evaluateStreetSegmentsOverlap = function(streetSegment, dataSet, entity, constraintSet, ruleDef){
  var Model = mongoose.model(entity);
  var isViolated = false;
  var deferred = when.defer();

  // create the oddEvenBoth query outside based on a conditional

  // basically check to see if the other segment has a "both" value or is equal to the current segment
  // and also if the current segment is "both" then have an empty query so that it's not a limiter.
  // (we can't check the value of the current segment only the values of the segments we are retrieving)
  // This will also allow the other segment to be blank and our current segment to have a value of "both"
  var oddEvenBothQuery = [{'oddEvenBoth': 'both'},{'oddEvenBoth': streetSegment.oddEvenBoth}];
  if(streetSegment.oddEvenBoth == 'both'){
    oddEvenBothQuery = [{}];
  }

  promise = Model
    .find(
    {
      // find all street segments in this feed
      _feed:streetSegment._feed,
      $and: [
        // where the startHouseNumber is between the start and end house number of the other segment or the
        // endHouseNumber is between the start and end house number of the other segment and
        {$or: [
          { $and: [{ 'startHouseNumber': { $gte: streetSegment.startHouseNumber }}, { 'startHouseNumber': { $lte: streetSegment.endHouseNumber }}] },
          { $and: [{ 'endHouseNumber': { $gte: streetSegment.startHouseNumber }}, { 'endHouseNumber': { $lte: streetSegment.endHouseNumber }}] },
          { $and: [{ 'startHouseNumber': { $lte: streetSegment.startHouseNumber }}, { 'endHouseNumber': { $gte: streetSegment.endHouseNumber }}] }
        ]},
        // where oddEvenBoth is the same or either one is 'both'
        { $or: oddEvenBothQuery }
      ]
    })
    .where('elementId').ne(streetSegment.elementId) // that is not the current street segment segment
    .where('nonHouseAddress.streetDirection').equals(streetSegment.nonHouseAddress.streetDirection) // where streetDirection is the same
    .where('nonHouseAddress.streetSuffix').equals(streetSegment.nonHouseAddress.streetSuffix) // where streetSuffix is the same
    .where('nonHouseAddress.addressDirection').equals(streetSegment.nonHouseAddress.addressDirection) // where addressDirection is the same
    .where('nonHouseAddress.streetName').equals(streetSegment.nonHouseAddress.streetName) // where streetName is the same
    .where('nonHouseAddress.city').equals(streetSegment.nonHouseAddress.city) // where city is the same
    .where('nonHouseAddress.zip').equals(streetSegment.nonHouseAddress.zip) // where zip is the same
    .exec();

  promise.then(function(results){

    isViolated = false;
    var resultObject = streetSegment;
    if(results.length > 0){
      isViolated = true;

      resultObject = "";

      for(var i=0; i<results.length; i++){
        resultObject += "{" + "id: " + results[i].elementId + ", startHouseNumber: " + results[i].startHouseNumber + ", endHouseNumber: " + results[i].endHouseNumber + "}"
      }

    }

    //note: if the rule isn't violated, we can resolve with default values for the entity set as they will be ignored
    deferred.resolve({isViolated: isViolated, dataItem: resultObject, dataSet: dataSet, entity: entity, ruleDef: ruleDef});

  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}

exports.evaluate = evaluateStreetSegmentsOverlap;