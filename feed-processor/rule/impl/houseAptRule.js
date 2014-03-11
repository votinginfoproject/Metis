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
