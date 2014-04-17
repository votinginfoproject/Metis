
var mongoose = require('mongoose');


function fetchEntityData(entity, resultFields, feedId, returnData, done){

  var Model = mongoose.model(entity);

  var stream = Model.find(formatQueryArgs(feedId), formatSearchResultFields(resultFields)).stream();

  stream.on('data', function(result){
    returnData(result);
  });

  stream.on('error', function(err){
    done(err);
  });

  stream.on('close', function() {
    done(null);
  });

  return { stream: stream, saveStackCount: 0, isPaused: false };
}

function resolveRuleWithConstraints(entity, resultFields, feedId, rule, returnData, done){
  return fetchEntityData(entity, resultFields, feedId, function(results){

    returnData( { dataResults: results, retrieveRule: rule, entity: entity } );

  }, function() { done() });
}

/**
 * future: to be used to pair down result set members
 * @param vipFeedId
 * @returns {{}}
 */
var formatQueryArgs = function(vipFeedId){
  var queryArgs = {};
  if(vipFeedId !== null && vipFeedId !== "") {
    queryArgs = { '_feed':vipFeedId };
  }
  return queryArgs;
};

/**
 * future: to be used to pair down result set members
 * @param resultFields
 * @returns {{}}
 */
var formatSearchResultFields = function(resultFields){
  var queryFields = {};

  if(resultFields != null && resultFields.length > 0){
    for(var i = 0; i < resultFields.length; i++)
      queryFields[resultFields[i]] = 1;
  }
  queryFields['elementId'] = 1;
  queryFields['_feed'] = 1;

  if(resultFields.length > 0){
    return queryFields;
  } else {
    // street segments overlap would apply here
    return {};
  }

}

exports.fetchEntityData = fetchEntityData;
exports.applyConstraints = resolveRuleWithConstraints;