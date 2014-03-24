var mongoose = require('mongoose');
var ruleViolation = require('../ruleViolation')

var errorCount = 0;
var constraints = null;
var rule = null;

var evaluateHouseAptNumber = function(feedId, constraintSet, ruleDefinition, callback){
  rule = ruleDefinition;
  constraints = constraintSet;
  var fieldStrings = [];

  var fields = {};
  fields['_feed'] = 1;
  fields['elementId'] = 1;

  var Model = mongoose.model(constraintSet.entity[0]);

  // get the constraint fields
  var conditions = [];
  for(var i=0; i< constraints.fields.length; i++){
    var field = constraints.fields[i];
    fieldStrings[i] = field.toString();

    fields[fieldStrings[i]] = 1;

    var fieldProp = fieldStrings[i];

    var cond1 = {};
    cond1[fieldProp] = { $exists: true };
    var cond2 = {};
    cond2[fieldProp] = { $lte: 0 };

    conditions.push(
      { $and: [cond1, cond2] }
    );
  }

  var stream = Model.find( { _feed: feedId, $or: conditions }, fields ).stream();

  stream.on('data', function(houseAptNumSegmentResult){
    if(houseAptNumSegmentResult.length > 0) {

      houseAptNumSegmentResult.forEach(function(houseAptNumSegmentResultSet, index){

        var resultSet= "";
        for(var i = 0; i < constraints.fields.length; i++){
          var prop = constraints.fields[i];

          if(houseAptNumSegmentResultSet[prop]!== undefined){
            resultSet+= prop + "=" + (houseAptNumSegmentResultSet[prop]).toString() + ", ";
          }
        }

        // remove trailing comma
        if(resultSet.lastIndexOf(", ") === resultSet.length-2){
          resultSet = resultSet.substr(0, resultSet.length-2);
        }

        // creating the error details
        resultSet = "{" + resultSet + "}";

        createError(houseAptNumSegmentResultSet, resultSet);
      });

    }
  });

  stream.on('end', function() {
    callback({ promisedErrorCount: errorCount });
  });

  stream.on('error', function(){
    callback(null);
  });
}

function createError(houseAptNumSegment, directionalError) {
  errorCount++;
  var ruleErrors = new ruleViolation(constraints.entity[0], houseAptNumSegment.elementId, houseAptNumSegment._id, houseAptNumSegment._feed, directionalError, directionalError, rule);
  return ruleErrors.model().save();
}

exports.evaluate = evaluateHouseAptNumber;

/*
 var mongoose = require('mongoose');
 var ruleViolation = require('../ruleviolation');
 var when = require('when');

 var deferred = when.defer();
 var errorCount = 0;
 var constraints = null;
 var rule = null;

 var evaluateHouseAptNumber = function(feedId, constraintSet, ruleDefinition){
 rule = ruleDefinition;
 constraints = constraintSet;
 var savePromises = [];
 var fieldStrings = [];

 for(var i=0; i< constraints.fields.length; i++){

 var field = constraints.fields[i];
 fieldStrings[i] = field.toString();

 errorList = null;
 Model = mongoose.model(constraintSet.entity[0]);

 var conditions = {};
 conditions['_feed'] = feedId;
 conditions[fieldStrings[i]] = { $exists: true, $lte: 0};

 var fields = {};
 fields['_feed'] = 1;
 fields['elementId'] = 1;
 fields[fieldStrings[i]] = 1;

 savePromises.push(Model.find(conditions, fields).exec());
 }

 var errorPromises = [];

 when.all(savePromises).then(
 function(houseAptNumSegmentResult){

 houseAptNumSegmentResult.forEach(function(houseAptNumSegmentResultSetArray, index){

 houseAptNumSegmentResultSetArray.forEach(function(houseAptNumSegmentResultSet){

 var fieldPath = fieldStrings[index].split(".");
 var resultSet= houseAptNumSegmentResultSet;
 for(var i=0; i< fieldPath.length; i++){
 var path = (fieldPath[i]).toString();
 resultSet = resultSet[path];
 }

 errorPromises.push(createError(houseAptNumSegmentResultSet, fieldStrings[index] + " = " + resultSet));
 });

 });
 when.all(errorPromises).then( function(emptyPromises){  deferred.resolve({ promisedErrorCount: errorCount }) });
 }
 );
 return deferred.promise;
 }

 function createError(houseAptNumSegment, directionalError) {
 errorCount++;
 ruleErrors = new ruleViolation(constraints.entity[0], houseAptNumSegment.elementId, houseAptNumSegment._id, houseAptNumSegment._feed, directionalError, directionalError, rule);
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
 exports.evaluate = evaluateHouseAptNumber;
 */