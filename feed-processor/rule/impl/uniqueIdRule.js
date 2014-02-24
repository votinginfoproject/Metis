/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var when = require('when');

var Violation = require('../ruleviolation');

var evaluateUniqueId = function(uniqueId, dataSet, entity, constraintSet, ruleDef){
  //console.log(uniqueId, dataSet, entity, constraintSet);
  var deferred = when.deferred();
  var Model = null;
  var isViolated = false;
  var resolution = {isViolated: isViolated, dataItem: null, dataSet: null, entity: null, ruleDef: null };
  var allResults = [];


  when.all(allResults).then(

    function(results){

      if(results[0] != undefined && results[0].isViolated){
        console.log('vio:', results);
        deferred.resolve(results[0]);
      }
      else
        deferred.resolve(resolution);
    },
    function(err){
      console.log("all kinds of errors coming back in ID Rule");
    }
  );

  constraintSet.entity.forEach(function(thisEntity, next){
    if(isViolated) next();
    Model = mongoose.model(thisEntity);
    promise = Model
      .find({_feed:dataSet._feed})
      .where({'elementId':uniqueId}, {_feed:1, _id:1, elementId:1})
      .exec();
    promise.then(function(results){
      if(results.length > 1){
        isViolated = true;
        console.log('resolving..');
        resolution = {isViolated: isViolated, dataItem: uniqueId, dataSet: dataSet, entity: entity, ruleDef: ruleDef };
        allResults.push(resolution);
      }
    });
    promise.onerror = function(){
      deferred.reject(new Error("Issues During Data Processing"));
    };
  },
  function(err){
    if(!isViolated){

    }

  });

  return deferred.promise;
}

exports.evaluate = evaluateUniqueId;