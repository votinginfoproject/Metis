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

  console.log("--------")
  console.log(streetSegment);

  promise = Model
    .find({_feed:streetSegment._feed}) // find streetsegments
    .where({'_id': {$nin: [streetSegment._id]}}) // that are not the current street segment
    //.where({'nonHouseAddress.streetName':streetSegment.nonHouseAddress.streetName})
    //.where('startHouseNumber')

    //streetname
    //suffix
    //street-direction
    //address-direction
    //
    //state
    //city
//.gt(streetSegment.startHouseNumber)
//.lt(streetSegment.endHouseNumber)
    .exec();

  promise.then(function(results){

    console.log("results....." + results.length)
    //console.log(results);

    if(results.length > 1){
      isViolated = true;
    }
//note: if the rule isn't violated, we can resolve with default values for the entity set as they will be ignored
    deferred.resolve({isViolated: isViolated, dataItem: streetSegment, dataSet: dataSet, entity: entity, ruleDef: ruleDef});

  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}

exports.evaluate = evaluateStreetSegmentsOverlap;