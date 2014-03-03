/**
 * Created by nboseman on 2/12/14.
 */

var mongoose = require('mongoose');
var ruleViolation = require('../ruleviolation');
var when = require('when');

var deferred = when.defer();
var errorCount = 0;
var constraints = null;
var rule = null;

var addressDirectionTypesList = ['n','s','e','w','nw','ne','sw','se','north','south','east','west','northeast','northwest','southeast','southwest'];

var evaluateAddressDirectionType = function(feedId, constraintSet, ruleDefinition){
  rule = ruleDefinition;
  constraints = constraintSet;
  var savePromises = [];
  var savePromises2= [];

  errorList = null;
  Model = mongoose.model(constraintSet.entity[0]);
  upperCaseMap = addressDirectionTypesList.map(function(item, index){ return item.toUpperCase(); });
  mixedCaseDirections = upperCaseMap.concat(addressDirectionTypesList);
  savePromises.push(Model.find({'_feed':feedId, 'nonHouseAddress.streetDirection': { $exists: true, $nin: mixedCaseDirections }}, {'_feed':1, 'elementId':1, 'nonHouseAddress.streetDirection':1}).exec()); //formatReturnFields(constraintSet[1])
  //savePromises.push(Model.find({ 'nonHouseAddress.addressDirection': { $exists: true, $nin: mixedCaseDirections }}, {'_feed':1, 'elementId':1, 'nonHouseAddress.addressDirection':1}).exec());

  var errorPromises = [];

  when.all(savePromises).then(
    function(streetSegmentResult){
        streetSegmentResult[0].forEach(function(streetSegmentResultSet){
          errorPromises.push(createError(streetSegmentResultSet, "nonHouseAddress.streetDirection = " + streetSegmentResultSet.nonHouseAddress.streetDirection));
        });
       when.all(errorPromises).then( function(emptyPromises){  deferred.resolve({ promisedErrorCount: errorCount }) });
     }
    );
  return deferred.promise;
}

function createError(streetSegment, directionalError) {
  errorCount++;
  ruleErrors = new ruleViolation(constraints.entity[0], streetSegment.elementId, streetSegment._id, streetSegment._feed, directionalError, directionalError, rule);
  return ruleErrors.model().save();
}

var formatReturnFields = function (fields) {
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
