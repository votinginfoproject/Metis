
var mongoose = require('mongoose');
var logger = (require('../../logging/vip-winston')).Logger;

function resolveRuleWithConstraints(entity, resultFields, feedId, rule, returnData) {

  // Get the model from mongoose, and start the stream.
  var Model = mongoose.model(entity);
  var stream = Model.find(formatQueryArgs(feedId), formatSearchResultFields(resultFields)).stream();

  // When it gets data back return the data.
  stream.on('data', function(result){
    returnData( { dataResults: result, retrieveRule: rule, entity: entity } );
  });

  // If there is an error send back the 'error code' and log the error
  stream.on('error', function(err){
    logger.Error('Error with streaming ' + entity);
    logger.Error(err);
    returnData(-1);
  });

  // When the stream closes send back null so that it knows that there is no more data coming.
  stream.on('close', function() {
    returnData(null);
  });

  // return the stream data so it can track the saves and wither or not to pause the stream.
  return { stream: stream, saveStackCount: 0, isPaused: false };
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

exports.applyConstraints = resolveRuleWithConstraints;