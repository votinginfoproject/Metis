/**
 * Created by rcartier13 on 5/6/14.
 */

var evaluateOrphanedEntity = function(feedId, constraintSet, ruleDefinition, callback){

  var mongoose = require('mongoose');
  var when = require('when');
  var totalCounted = 0;

  var searchResults = {};
  if(constraintSet.fields.length == 3)
    searchResults[constraintSet.fields[0]] = 1;
  searchResults['_id'] = 1;
  searchResults['elementId'] = 1;

  var model = mongoose.model(constraintSet.entity[0]);

  var stream = model.find({_feed: feedId}, searchResults).stream();

  stream.on('data', foundEntity);
  stream.on('close', function(err) {
    if(totalCounted == 0) {
      callback({ isViolated: false, promisedErrorCount: 0 });
    }
  });

  var createPromises = [];
  var errorCount = 0;
  function foundEntity(doc) {

    if(constraintSet.fields.length && doc[constraintSet.fields[0]]) {
      return;
    }

    var matchResults = {};
    matchResults['_feed'] = feedId;
    matchResults[constraintSet.fields[1]] = { $in: [doc._id] };

    var secondModel = mongoose.model(constraintSet.entity[1]);
    var thirdModel = mongoose.model(constraintSet.entity[2]);
    var promise = when.join(secondModel.count(matchResults).exec(),
      thirdModel.count(matchResults).exec());

    totalCounted++;

    promise.then(function (counts) {
      --totalCounted;
      if (counts[0] == 0 && counts[1] == 0) {
        ++errorCount;
        createPromises.push(createError(doc));
      }

      if(totalCounted == 0) {
        when.all(createPromises).then(function(empty) {
          callback({ promisedErrorCount: errorCount })
        });
      }
    });
  }

  function createError(doc) {
    var errorModel =  mongoose.model(constraintSet.entity[0].substring(0, constraintSet.entity[0].length-1) + 'errors');
    return errorModel.create({
      severityCode: ruleDefinition.severityCode,
      severityText: ruleDefinition.severityText,
      errorCode: ruleDefinition.errorCode,
      title: ruleDefinition.title,
      details: constraintSet.entity[0] + " has no entities linked to them.",
      textualReference: "elementId: " + doc.elementId,
      refElementId: doc.elementId,
      _ref: doc._id,
      _feed: feedId
    });
  }

};


exports.evaluate = evaluateOrphanedEntity;