/**
 * Created by nboseman on 2/12/14.
 */

var mongoose = require('mongoose');
var ruleViolation = require('../ruleViolation');
var async = require('async');

var errorCount = 0;
var constraints = null;
var rule = null;

var directionTypesList = ['n','s','e','w','nw','ne','sw','se','north','south','east','west','northeast','northwest','southeast','southwest'];

var evaluateAddressDirectionType = function(feedId, constraintSet, ruleDefinition, callback){
  rule = ruleDefinition;
  constraints = constraintSet;
  var fieldStrings = [];

  var i = 0;
  async.eachSeries(constraints.fields, function(constrant, done) {

    var field = constrant;
    fieldStrings[i] = field.toString();

    var Model = mongoose.model( constraintSet.entity[0] );
    var upperCaseMap = directionTypesList.map( function(item, index) { return item.toUpperCase(); });
    var lowerCaseMap = directionTypesList.map( function(item, index) { return item.toLowerCase(); });

    //  also adding in empty string and null as ok values
    var mixedCaseDirections = [];
    mixedCaseDirections = mixedCaseDirections.concat(upperCaseMap);
    mixedCaseDirections = mixedCaseDirections.concat(lowerCaseMap);
    mixedCaseDirections = mixedCaseDirections.concat(['', null]);

    var conditions = {};
    conditions['_feed'] = feedId;
    conditions[fieldStrings[i]] = { $exists: true, $nin: mixedCaseDirections };

    var fields = {};
    fields['_feed'] = 1;
    fields['elementId'] = 1;
    fields[fieldStrings[i]] = 1;

    var stream = Model.find(conditions, fields).stream();

    var paused = false;
    var saveStack = 0;
    stream.on('data', function(addressSegmentResultSet) {
      ++saveStack;

      if(saveStack >= 10000) {
        paused = true;
        stream.pause();
      }

      var fieldPath = fieldStrings[i].split(".");
      var resultSet= addressSegmentResultSet;
      for(var x = 0; x < fieldPath.length; x++){
        var path = (fieldPath[x]).toString();
        resultSet = resultSet[path];
      }
      createError(addressSegmentResultSet, fieldStrings[i] + " = " + resultSet)
        .then(function() {
          --saveStack;
          if(paused && saveStack === 0) {
            paused = false;
            stream.resume();
          }
        });
    });

    stream.on('close', function(err) {
      ++i;
      done();
    });
  }, function() {
//    console.log(errorCount + ' errors added');
    callback( { promisedErrorCount: errorCount } )
  });
}

function createError(addressSegment, directionalError) {
  errorCount++;
  var ruleErrors = new ruleViolation(constraints.entity[0], addressSegment.elementId, addressSegment._id, addressSegment._feed, directionalError, directionalError, rule);
  return ruleErrors.getCollection().create(ruleErrors.model());
}

exports.evaluate = evaluateAddressDirectionType;