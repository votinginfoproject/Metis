/**
 * Created by nboseman on 2/12/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var utils = require('../../utils');

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

    // still need the below, to not pull back null or empty strings
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

      var resultSet = utils.getProperty(addressSegmentResultSet, fieldStrings[i]);

      if(!resultSet || resultSet.trim() === '') {
        return;
      }

      ++saveStack;

      if(saveStack >= 10000) {
        paused = true;
        stream.pause();
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

    callback( { promisedErrorCount: errorCount } )
  });
}

function createError(addressSegment, directionalError) {
  errorCount++;
  var model =  mongoose.model(constraints.entity[0].substring(0, constraints.entity[0].length-1) + 'errors');
  return model.create({
    severityCode: rule.severityCode,
    severityText: rule.severityText,
    errorCode: rule.errorCode,
    title: rule.title,
    details: directionalError,
    textualReference: 'id = ' + addressSegment.elementId + " (" + directionalError + ")",
    refElementId: addressSegment.elementId,
    _ref: addressSegment._id,
    _feed: addressSegment._feed
  });
}

exports.evaluate = evaluateAddressDirectionType;