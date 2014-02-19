/**
 * Created by nboseman on 2/13/14.
 */

/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var when = require('when');

var Violation = require('../ruleviolation');

var evaluate = function(streetSegment, dataSet, entity, constraintSet, ruleDef){
  var Model = mongoose.model(entity);
  var isViolated = false;


  promise = Model
    .find({_feed:streetSegment._feed})
    .where({'nonHouseAddress.streetName':streetSegment.nonHouseAddress.streetName})
    .where('startHouseNumber')
    .gt(streetSegment.startHouseNumber)
    .lt(streetSegment.endHouseNumber)
    .exec();

  promise.then(function(results){
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

exports.evaluate = evaluate;