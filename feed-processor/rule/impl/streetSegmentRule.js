/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var when = require('when');

var interval = require('interval-query');
var tree = new interval.SegmentTree;


var evaluate = function(feedId, constraintSet, ruleDefinition){
  var Model = mongoose.model("streetSegments");
  var isViolated = false;
  var deferred = when.defer();
  var segmentQueries = [];

  promise = Model.find({ '_feed':feedId }).exec();

  promise.then(function(streetSegments){

     streetSegments.forEach(function(streetSegment){
     // console.log(streetSegment);
      segmentQueries.push( Model.find(
       {'_feed':streetSegment._feed,
        'startHouseNumber': { $gte : streetSegment.startHouseNumber },
        'endHouseNumber': { $lte : streetSegment.endHouseNumber },
        'oddEvenBoth': streetSegment.oddEvenBoth,
        'nonHouseAddress.streetName': streetSegment.nonHouseAddress.streetName,
        //'nonHouseAddress.streetDirection': streetSegment.streetDirection,
        'nonHouseAddress.streetSuffix': streetSegment.streetSuffix,
        'nonHouseAddress.city': streetSegment.nonHouseAddress.city,
        'nonHouseAddress.zip': streetSegment.nonHouseAddress.zip,
         $nin : { '_id':streetSegment._id } },
      { '_feed':1,
        'elementId':1,
        'oddEvenBoth': 1,
        'nonHouseAddress.streetName': 1,
        'nonHouseAddress.streetDirection': 1,
        'nonHouseAddress.streetSuffix': 1,
        'nonHouseAddress.city': 1,
        'nonHouseAddress.zip': 1 })
      .exec());
       //console.log('length', segmentQueries.length());
     });

    when.all(segmentQueries).then(function(streetSegments){
      console.log('what came back..', streetSegments);
      promisedSegments = 0;
      deferred.resolve({isViolated: isViolated, promisedErrorCount: promisedSegments});
    });
  });



    //async.each(results, buildIntervals, function(err){

      //query to see if there are any overlaps in returned intervals and set violation status
      //overlaps = tree.queryInterval(streetSegment.startHouseNumber, streetSegment.endHouseNumber);
      //isViolated = (overlaps != null && overlaps > 0);

    //});

  //});
  //promise.onerror = function(){
  //  deferred.reject(new Error("Issues During Street Segment Validation"));
 // };

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