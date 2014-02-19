
var mongoose = require('mongoose');
var when = require('when');


function fetchEntityData(entity, searchTerms, resultFields){

  var Model = mongoose.model(entity);
  var deferred = when.defer();

  promise = Model.find(formatQueryArgs(searchTerms), formatSearchResultFields(resultFields)).exec();
  promise.then(function(results){
    deferred.resolve(results);
  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}
/*
function resolveRuleWithConstraints(entity, searchTerms, resultFields, rule){

 return when.resolve(
   {
     resolveEntityData: fetchEntityData(entity, searchTerms, resultFields),
     retrieveRule: rule,
     entity: entity
   }
 );
}
*/
function resolveRuleWithConstraints(entity, searchTerms, resultFields, rule){

  var deferredResults = when.defer();
  fetchEntityData(entity, searchTerms, resultFields).then(
    function(results){
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
  /*
  var queryArgs = {};
  if(vipFeedId != null && vipFeedId != "") {
    queryArgs = { "_feed":vipFeedId };
  }
  */
  return {};  //future this will utilized for performance gains within larger feed sets
};

/**
 * future: to be used to pair down result set members
 * @param resultFields
 * @returns {{}}
 */
var formatSearchResultFields = function(resultFields){
  /*
  var searchThings = {};
  if(resultFields != null && resultFields[0] != ""){
    resultField = resultFields[0];
  }
  */
  return {};  //future this will utilized for performance gains within larger feed sets
}

exports.fetchEntityData = fetchEntityData;
exports.applyConstraints = resolveRuleWithConstraints;