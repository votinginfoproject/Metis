/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var when = require('when');

var interval = require('interval-query');
var tree = new interval.SegmentTree;

var evaluate = function(streetSegment, dataSet, entity, constraintSet, ruleDef){
  var Model = mongoose.model(entity);
  var isViolated = false;
  var deferred = when.defer();

  promise = Model
    .find({'_feed':streetSegment._feed,
      'nonHouseAddress.streetName': streetSegment.nonHouseAddress.streetName,
      'nonHouseAddress.streetDirection': streetSegment.streetDirection,
      'nonHouseAddress.streetSuffix': streetSegment.streetSuffix,
      'nonHouseAddress.city': streetSegment.nonHouseAddress.city,
      'nonHouseAddress.zip': streetSegment.nonHouseAddress.zip },
    { '_feed':1,
      'nonHouseAddress.streetName': 1,
      'nonHouseAddress.streetDirection': 1,
      'nonHouseAddress.streetSuffix': 1,
      'nonHouseAddress.city': 1,
      'nonHouseAddress.zip': 1 }
    ).exec();

  promise.then(function(results){
    async.each(results, buildIntervals, function(err){

      //query to see if there are any overlaps in returned intervals and set violation status
      overlaps = tree.queryInterval(streetSegment.startHouseNumber, streetSegment.endHouseNumber);
      isViolated = (overlaps != null && overlaps > 0);
      deferred.resolve({isViolated: isViolated, dataItem: streetSegment, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
    });

  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Street Segment Validation"));
  };

  return deferred.promise;
}

function buildIntervals(returnedSegment, nextSegment){
  if(isCompleteSegment(returnedSegment.startHouseNumber, returnedSegment.endHouseNumber)){
    tree.pushInterval(returnedSegment.startHouseNumber, returnedSegment.endHouseNumber);
  }
  nextSegment();
}

function isCompleteSegment(start, end){
  isComplete = (start != null && start != "" && end != null && end != "");
  return isComplete;
}
exports.evaluate = evaluate;