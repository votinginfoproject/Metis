/**
 * Created by nboseman on 2/12/14.
 */

var mongoose = require('mongoose');
var ruleViolation = require('../ruleviolation');
var schemas = require('../../../dao/schemas');
var when = require('when');

var isViolated = false;
rule = null;
var addressDirectionTypesList = ['n','s','e','w','nw','ne','sw','se','north','south','east','west','northeast','northwest','southeast','southwest'];
/*
var evaluateAddressDirectionType = function(addressDirectionType, dataSet, entity, constraintSet, ruleDef){

  var isViolated = false;

  if((addressDirectionType == null || addressDirectionType == "")){
    isViolated = false;
  }
  else {
    isViolated = (addressDirectionTypesList.indexOf(addressDirectionType.trim().toLowerCase()) < 0);
  }
  return when.resolve({isViolated: isViolated, dataItem: "direction = " + addressDirectionType, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateAddressDirectionType;
  */

//"direction = " + addressDirectionType


var evaluateAddressDirectionType = function(feedId, constraintSet, ruleDefinition){
  rule = ruleDefinition;
  var deferred = when.defer();
  var savePromises = [];
  Model = mongoose.model(constraintSet.entity[0]);
  console.log("feedId", feedId);
  promise = Model.find({ '_feed': feedId },{'nonHouseAddress.addressDirection':1,'elementId':1,'_feed':1}).exec();

  ruleErrors = null;
  promise.then(function(streetSegments){
  //console.log(streetSegments);
  streetSegments.forEach(function(streetSegment){
    //savePromises.push(createError(streetSegment, "addressDirection = " + streetSegment._nonHouseAddress.addressDirection));
    ruleErrors = new ruleViolation(errorModel.model.modelName, streetSegment.elementId, streetSegment._id, streetSegment._feed, "addressDirection = " + streetSegment._nonHouseAddress.addressDirection, "elementId = " + streetSegment.elementId, rule);
    savePromises.push(ruleErrors.model());
  });
});
/*
  promise2 = Model.find({ '_feed': feedId },{'nonHouseAddress.streetDirection':1,'elementId':1,'_feed':1}).exec();

  promise2.then(function(streetSegment){
    savePromises.push(createError(streetSegment, "streetDirection = " + streetSegment._nonHouseAddress.streetDirection));
  });
*/
  when.all(savePromises).then(function(promisedErrors){ deferred.resolve({ isViolated: false, errorList: promisedErrors})});

  return deferred.promise;
}


function createError(errorModel, directionalError, id) {
  ruleErrors = new ruleViolation(null, errorModel.elementId, errorModel._id, errorModel._feed, directionalError, "elementId = " + id, rule);
  violation = ruleErrors.model(errorModel.model.modelName);
  return violation; //violation.save();
}

function formatReturnFields(fields) {
  var queryFields = {};
  if(resultFields != null && resultFields.length > 0){
    for(i = 0; i < resultFields.length; i++)
      queryFields[resultFields[i]] = 1;
  }
  queryFields['elementId'] = 1;
  queryFields['_feed'] = 1;
  return queryFields;
}
  exports.evaluate = evaluateAddressDirectionType;
