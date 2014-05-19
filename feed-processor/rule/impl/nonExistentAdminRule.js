/**
 * Created by rcartier13 on 5/19/14.
 */

var nonExistentAminRule = function(feedId, constraintSet, ruleDefinition, callback){

  var schemas = require('../../../dao/schemas');
  var when = require('when');

  schemas.models.states.findOne({_feed: feedId})
    .select({ electionAdministrationId: 1, _electionAdministration: 1, elementId: 1, _id: 1 })
    .exec(function(err, state) {
      if(state.electionAdministrationId && !state._electionAdministration) {
        var promise = schemas.models.states.Error.create({
          severityCode: ruleDefinition.severityCode,
          severityText: ruleDefinition.severityText,
          errorCode: ruleDefinition.errorCode,
          title: ruleDefinition.title,
          details: "States link to the Election Administration ID: " + state.electionAdministrationId + " does not exist",
          textualReference: "State elementId: " + state.elementId,
          refElementId: state.elementId,
          _ref: state._id,
          _feed: feedId
        });

        promise.then(function() {
          callback({promisedErrorCount: 1});
        });
      }
      else {
        callback({promisedErrorCount: 0});
      }
    });
};


exports.evaluate = nonExistentAminRule;