/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var when = require('when');
var url = require('url');

var evaluate = function(streetSegment, dataSet, entity, constraintSet, ruleDef){
  var deferred = when.defer();
  var Model = mongoose.model(entity);
  promise = Model
    .find({_feed:streetSegment._feed})
    .where({'nonHouseAddress.streetName':streetSegment.nonHouseAddress.streetName})
    //.where('startHouseNumber')
    //.gt(streetSegment.startHouseNumber)
    //.lt(streetSegment.endHouseNumber)
    .exec();
  promise.then(function(results){
    isViolated = false;
    if(results.length > 1)
      isViolated = true;

    deferred.resolve({isViolated: isViolated, dataItem: streetSegment, dataSet: dataSet, entity: entity, ruleDef: ruleDef});

  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}

exports.evaluate = evaluate;