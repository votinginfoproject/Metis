/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var when = require('when');
var url = require('url');

var evaluateUniqueId = function(uniqueId, dataSet, entity, constraintSet, ruleDef){
  var deferred = when.defer();
  var Model = null;
  var isViolated = false;

  //by default, the rule isn't violated and we can resolve with default values for the entity set as they will be ignored
  deferred.resolve({isViolated: isViolated, dataItem: uniqueId, dataSet: dataSet, entity: entity});

  constraintSet.entity.forEach(function(thisEntity, next){
    if(isViolated) next();
    Model = mongoose.model(thisEntity);
    promise = Model
      .find({_feed:dataSet._feed})
      .where({'elementId':uniqueId})
      .exec();
    promise.then(function(results){
      if(results.length > 1){
        isViolated = true;
        deferred.resolve({isViolated: isViolated, dataItem: uniqueId, dataSet: dataSet, entity: entity, ruleDef: ruleDef });
      }
    });
    promise.onerror = function(){
      deferred.reject(new Error("Issues During Fetch"));
    };
  });

  return deferred.promise;
}

exports.evaluate = evaluateUniqueId;