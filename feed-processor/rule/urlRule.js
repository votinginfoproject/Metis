/**
 * Created by nboseman on 1/10/14.
 */
var metisRule = require('./metisRule');
var util = require('util');
var Violation = require('./violation');
var events = require('events');

function UrlRule(){
  this.ruleDef = require('./ruledefs').ruleDefinitions.validUrlCheck;
  this.constraints = require('./constraints').validUrlCheck;

}

UrlRule.prototype.addViolation = function(violation){
  if(this.violations == undefined)
    this.violations = [];
  if(violation != null)
    this.violations[this.violations.length] = violation;
  saveViolation(violation);
}

function saveViolation(violation){
  violation.save();
}

UrlRule.prototype.evaluate = function(vipFeedId, constraintList){
  urlList = processUrls(require('../../config').mongoose.model.pollingLocation, [], vipFeedId, UrlRule.prototype.processUrlResults);
}

function processUrls(modelName, urlList, vipFeedId, callback){

  var queryArgs = {};  //format query
  if(vipFeedId != null && vipFeedId != "") {
    queryArgs = { "_feed":vipFeedId };
  }

  //format query projection
  var queryProjection = {"elementId":1, "photoUrl":1, "_feed":1};

  var Model = require('mongoose').model(modelName);
  Model.find(queryArgs, queryProjection, function(err, dataResults){     //Model.find({"_feed":vipFeedId}, {"id":1}, function(err, value){
    resultList = [];
    dataResults.forEach(function(element){
      if(element.elementId != null && element.elementId != ""){
        resultList[resultList.length] = {
          "collection":modelName, "elementId":element.elementId, "_id":element._id, "photoUrl":element.photoUrl, "_feed":element._feed
        };
        resultList[resultList.length] = element.elementId;
      }
    });
    callback(err, resultList);
  });
}

UrlRule.prototype.getViolations = function(){
  return this.violations;
}

UrlRule.prototype.processUrlResults = function(err, dataResults){
  resultList = [];
  dataResults.forEach(function(data){
    if(data.photoUrl != null && data.photoUrl != ""){
      resultList[resultList.length] = data;
      isValidUrl = require('./ruledefs').ruleDefinitions.validUrlFormat.evaluation(data.photoUrl);
      if(!isValidUrl)
        UrlRule.prototype.addViolation(
          new Violation(data.collection, data.elementId, require('./ruledefs').ruleDefinitions.validUrlFormat.description, data._id, data._feed)
      );
    }
  });
 console.log("Total Url Rule Violations:", UrlRule.prototype.getViolations().length);
}

module.exports = UrlRule;

