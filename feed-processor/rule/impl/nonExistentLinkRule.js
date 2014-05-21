/**
 * Created by rcartier13 on 5/19/14.
 */


var mongoose = require('mongoose');
var when = require('when');
var _ = require('underscore');

var nonExistentLinkRule = function(feedId, constraintSet, ruleDefinition, callback) {

  var model = mongoose.model(constraintSet.entity[0]);
  var totalErrors = 0;
  var promise = null;
  var searchResults = {};
  searchResults[constraintSet.fields[0]] = 1;
  searchResults[constraintSet.fields[1]] = 1;
  searchResults['_id'] = 1;
  searchResults['elementId'] = 1;

  var stream = model.find({ _feed: feedId }, searchResults).populate(constraintSet.fields[1]).stream();

  stream.on('data', function(doc) {

    var newProm;
    if(_.isString(doc._doc[constraintSet.fields[0]])) {
      newProm = checkSingle(doc._doc, constraintSet, ruleDefinition, feedId);
    }
    else {
      newProm = checkArray(doc._doc, constraintSet, ruleDefinition, feedId);
    }

    if(newProm) {
      ++totalErrors;
      promise = promise ? when.join(promise, newProm) : newProm;
    }

  });

  stream.on('close', function(err) {
    if(promise) {
      promise.then(function () {
        callback({ promisedErrorCount: totalErrors });
      });
    }
    else {
      callback({ promisedErrorCount: 0 });
    }
  });
};

function checkSingle(doc, constraintSet, ruleDefinition, feedId) {
  if(doc[constraintSet.fields[0]] && !doc[constraintSet.fields[1]]) {
    return createError(constraintSet, ruleDefinition, feedId, doc[constraintSet.fields[0]], doc.elementId, doc._id);
  }

  return null;
}

function checkArray(doc, constraintSet, ruleDefinition, feedId) {

  if( !doc[constraintSet.fields[0]] )
    return null;

  if(doc[constraintSet.fields[0]].length == doc[constraintSet.fields[1]].length)
    return null;

  var promise = null;
  for(var i = 0; i < doc[constraintSet.fields[0]].length; ++i) {
    var id = doc[constraintSet.fields[0]][i];
    var link = false;
    if(doc[constraintSet.fields[1]] && doc[constraintSet.fields[1]][i]) {
      if(doc[constraintSet.fields[1]][i].elementId != doc[constraintSet.fields[0]][i]) {

        doc[constraintSet.fields[1]].forEach(function(testLink) {
          if(doc[constraintSet.fields[0]][i] == testLink.elementId)
            link = true;
        });
      }
      else { link = true; }
    }

    if(id && !link) {
      var newProm = createError(constraintSet, ruleDefinition, feedId, id, doc.elementId, doc._id);

      if(newProm) {
        promise = promise ? when.join(promise, newProm) : newProm;
      }
    }
  }

  return promise;
}

function createError(constraintSet, ruleDefinition, feedId, badId, elementId, _id) {
  var errorModel =  mongoose.model(constraintSet.entity[0].substring(0, constraintSet.entity[0].length-1) + 'errors');
  var newProm = errorModel.create({
    severityCode: ruleDefinition.severityCode,
    severityText: ruleDefinition.severityText,
    errorCode: ruleDefinition.errorCode,
    title: ruleDefinition.title,
    details: "Link to ID: " + badId + " does not exist",
    textualReference: "elementId: " + elementId,
    refElementId: elementId,
    _ref: _id,
    _feed: feedId
  });

  return newProm;
}

exports.evaluate = nonExistentLinkRule;