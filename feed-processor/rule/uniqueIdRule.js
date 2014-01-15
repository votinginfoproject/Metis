/**
 * Created by nboseman on 12/23/13.
 */
var metisRule = require('./metisRule');
var util = require('util');
var Violation = require('./violation');
var events = require('events');

function UniqueIdRule(){
  this.ruleDef = require('./ruledefs').ruleDefinitions.uniqueIDCheck;
  this.constraints = require('./constraints').uniqueIDCheck.topLevelElements;
}


UniqueIdRule.prototype.evaluate = function(vipFeedId){
  require('async').inject(this.constraints, [], function(fullList, element, callback){
    process.nextTick(function(){
      fullList = getModelIds(element, fullList, vipFeedId, callback);
    });
  }, UniqueIdRule.prototype.processUniqueIds);
}

UniqueIdRule.prototype.addViolation = function(violation){
  if(this.violations == undefined)
    this.violations = [];
  if(violation != null)
    this.violations[this.violations.length] = violation;
  saveViolation(violation);
}

function saveViolation(violation){
  violation.save();
}

function getModelIds(modelName, fullList, vipFeedId, callback){

  var idList = (fullList[1] != null) ? fullList[1] : [];
  var resultList = (fullList[0] != null) ? fullList[0] : [];

  //format query
  var queryArgs = {};
  if(vipFeedId != null && vipFeedId != "") {
    queryArgs = { "_feed":vipFeedId };
  }

  var Model = require('mongoose').model(modelName);
  Model.find(queryArgs, {"elementId":1, "_id":1, "_feed":1}, function(err, value){     //Model.find({"_feed":vipFeedId}, {"id":1}, function(err, value){
    value.forEach(function(data){
      if(data.elementId != null && data.elementId != ""){
        resultList[resultList.length] = {
          "collection":modelName, "elementId":data.elementId, "_id":data._id, "_feed":data._feed
        };
        idList[idList.length] = data.elementId;
      }
    });
    fullList = [resultList, idList];
    callback(null, fullList);
  });
}

UniqueIdRule.prototype.getViolations = function(){
  return UniqueIdRule.prototype.violations;
}

UniqueIdRule.prototype.processUniqueIds = function(err, results){
  //verify the uniqueness of the IDs in the given list
  idList = results[1];
  topLevelCollection = results[0];
  topLevelCollection.forEach(function(result){
    origIndex = idList.indexOf(result.elementId);
    lastIndex = idList.lastIndexOf(result.elementId);
    if(origIndex != lastIndex){
      UniqueIdRule.prototype.addViolation(
        new Violation(result.collection, result.elementId, require('./ruledefs').ruleDefinitions.uniqueIDCheck.description, result._id, result._feed)
      );
    }
  });

  var violations = UniqueIdRule.prototype.getViolations();
  console.log("Total Unique ID Rule Violations:", violations ? violations.length : 'none');
};


module.exports = UniqueIdRule;
