var mongoose = require('mongoose');

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

  var conditions = createConstraints(fieldStrings, fields, constraintSet);

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

  stream.on('data', streamTo);
  stream.on('end', function() {
    callback({ promisedErrorCount: errorCount });
  });

  stream.on('error', function(){
    callback(null);
  });
}

function createError(houseAptNumSegment, directionalError) {
  errorCount++;
  var model =  mongoose.model(constraints.entity[0].substring(0, constraints.entity[0].length-1) + 'errors');
  return model.create({
    severityCode: rule.severityCode,
    severityText: rule.severityText,
    errorCode: rule.errorCode,
    title: rule.title,
    details: directionalError,
    textualReference: 'id = ' + houseAptNumSegment.elementId + " (" + directionalError + ")",
    refElementId: houseAptNumSegment.elementId,
    _ref: houseAptNumSegment._id,
    _feed: houseAptNumSegment._feed
  });
}

function streamTo(houseAptNumSegmentResult) {
  var resultSet= "";
  for(var i = 0; i < constraints.fields.length; i++){
    var prop = constraints.fields[i];

    if(houseAptNumSegmentResult[prop]){
      resultSet+= prop + "=" + (houseAptNumSegmentResult[prop]).toString() + ", ";
    }
  }

  // remove trailing comma
  if(resultSet.lastIndexOf(", ") === resultSet.length-2){
    resultSet = resultSet.substr(0, resultSet.length-2);
  }

  // creating the error details
  resultSet = "{" + resultSet + "}";

  createError(houseAptNumSegmentResult, resultSet);
}

function createConstraints(fieldStrings, fields, constraints) {
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
  return conditions;
}

exports.evaluate = evaluateHouseAptNumber;
exports.houseAptEval = createConstraints;

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