/**
 * Created by nboseman on 2/13/14.
 */
var mongoose = require('mongoose');
var async = require('async');
var when = require('when');
var ruleViolation = require('../ruleviolation');
var deferred = when.defer();

var evaluate = function(feedId, constraintSet, ruleDefinition){

  console.log("-------------")
  console.dir(feedId)
  console.log("-------------")
  console.dir(constraintSet)
  console.log("-------------")
  console.dir(ruleDefinition)
  console.log("-------------")

  var Model = mongoose.model(constraintSet.entity[0]);
  var isViolated = false;


  promise = Model
    .find({_feed: feedId})
//    .where({'nonHouseAddress.streetName':streetSegment.nonHouseAddress.streetName})
  //  .where('startHouseNumber')
    //.gt(streetSegment.startHouseNumber)
    //.lt(streetSegment.endHouseNumber)
    .exec();

  promise.then(function(results){

    console.log("then..............")
    console.dir(results);

    if(results.length > 1){
      isViolated = true;
    }
    //note: if the rule isn't violated, we can resolve with default values for the entity set as they will be ignored
    deferred.resolve({isViolated: isViolated, dataItem: streetSegment, dataSet: dataSet, entity: entity, ruleDef: ruleDef});

  });
  promise.onerror = function(){
    console.log("error..............")
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}

exports.evaluate = evaluate;