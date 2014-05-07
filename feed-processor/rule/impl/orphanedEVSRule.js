/**
 * Created by rcartier13 on 5/6/14.
 */

var evaluateOrphanedEVS = function(feedId, constraintSet, ruleDefinition, callback){

  var schemas = require('../../../dao/schemas');
  var when = require('when');
  var totalCounted = 0;

  var stream = schemas.models.earlyvotesites.find({_feed: feedId}, { _id: 1, elementId: 1, _locality: 1 }).stream();

  stream.on('data', foundEVS);
  stream.on('close', function(err) {
    if(totalCounted == 0) {
      callback({ isViolated: false, promisedErrorCount: 0 });
    }
  });

  var createPromises = [];
  var errorCount = 0;
  function foundEVS(evs) {

    if(evs._locality) {
      return;
    }

    var promise = when.join(schemas.models.precinctsplits.count({ _feed: feedId, earlyVoteSiteIds: { $in: [evs.elementId] } }).exec(),
      schemas.models.precincts.count({ _feed: feedId, earlyVoteSiteIds: { $in: [evs.elementId] }}).exec());

    totalCounted++;

    promise.then(function (counts) {
      --totalCounted;
      if (counts[0] == 0 && counts[1] == 0) {
        ++errorCount;
        createPromises.push(createError(evs));
      }

      if(totalCounted == 0) {
        when.all(createPromises).then(function(empty) {
          callback({ promisedErrorCount: errorCount })
        });
      }
    });
  }

  function createError(evs) {
    return schemas.models.earlyvotesites.Error.create({
      severityCode: ruleDefinition.severityCode,
      severityText: ruleDefinition.severityText,
      errorCode: ruleDefinition.errorCode,
      title: ruleDefinition.title,
      details: "Early Vote Site is not referenced by any Precincts, Precinct Splits, or Localities",
      textualReference: "elementId: " + evs.elementId,
      refElementId: evs.elementId,
      _ref: evs._id,
      _feed: feedId
    });
  }

};


exports.evaluate = evaluateOrphanedEVS;