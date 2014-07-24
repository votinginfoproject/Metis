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
    details: "House or Apartment Number is Invalid",
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