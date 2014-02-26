
var mongoose = require('mongoose');
var when = require('when');


function fetchEntityData(entity, resultFields, feedId){

  var Model = mongoose.model(entity);
  var deferred = when.defer();

  promise = Model.find(formatQueryArgs(feedId), formatSearchResultFields(resultFields)).exec();
  promise.then(function(results){
    deferred.resolve(results);
  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}

function resolveRuleWithConstraints(entity, resultFields, feedId, rule){

  var deferredResults = when.defer();
  fetchEntityData(entity, resultFields, feedId).then(
    function(results){
      //TODO: add debug level -->      console.log('results found for ' + rule.title, results.length);

      deferredResults.resolve(
        {
          dataResults: results,
          retrieveRule: rule,
          entity: entity
        }
      );
    },
    function(error){
      deferredResults.reject(new Error("Issues During Fetch"));
    });
  return deferredResults.promise;
}

/**
 * future: to be used to pair down result set members
 * @param vipFeedId
 * @returns {{}}
 */
var formatQueryArgs = function(vipFeedId){
  var queryArgs = {};
  if(vipFeedId != null && vipFeedId != "") {
    queryArgs = {'_feed':vipFeedId};
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
    for(i = 0; i < resultFields.length; i++)
      queryFields[resultFields[i]] = 1;
  }

  return queryFields;
}

exports.fetchEntityData = fetchEntityData;
exports.applyConstraints = resolveRuleWithConstraints;