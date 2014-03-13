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
    //.where({'oddEvenBoth':streetSegment.oddEvenBoth}) // oddEvenBoth
    //.where({'nonHouseAddress.streetDirection':streetSegment.nonHouseAddress.streetDirection}) // street direction
    //.where({'nonHouseAddress.houseNumberSuffix':streetSegment.nonHouseAddress.houseNumberSuffix}) // suffix is the same
    //.where({'nonHouseAddress.addressDirection':streetSegment.nonHouseAddress.addressDirection}) // address direction
    //.where({'nonHouseAddress.streetName':streetSegment.nonHouseAddress.streetName}) // streetname is the same
    //.where({'nonHouseAddress.city':streetSegment.nonHouseAddress.city}) // city
    //.where({'nonHouseAddress.zip':streetSegment.nonHouseAddress.zip}) // zip

    // start_house_number between the other segments start and end house numbers

//.gt(streetSegment.startHouseNumber)
//.lt(streetSegment.endHouseNumber)
    .exec();

  promise.then(function(results){

    console.log("results....." + results.length)
    console.log(results);

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