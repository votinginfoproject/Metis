
var fetcher = require('./dataFetcher');
var Violation = require('./ruleViolation');
var ActiveRuleStats =require('./ruleObserver');
var violationCount = 0;
var rules = {};


var async = require('async');
var fn = require('when/function');
var when = require('when');


function Rule(ruleDef){
  this.implementation = ruleDef.implementation;
  this.description = ruleDef.severityText;
  this.title = ruleDef.title;
  this.ruleDef = ruleDef;
  this.type = ruleDef.type;
  this.dataConstraints = ruleDef.dataConstraints;
}

function RuleHandler() {}

RuleHandler.prototype.createRule = function(ruleDef){
  if(!rules[ruleDef.ruleId]){
    rules[ruleDef.ruleId] = new Rule(ruleDef);
  }
  return rules[ruleDef.ruleId];
}

RuleHandler.prototype.applyRule = function(rule, feedId, ruleEngineCompletionCallback){
  ActiveRuleStats.applyRule(rule.ruleDef);
  RuleHandler.prototype.ruleInstance = rule;
  RuleHandler.prototype.vipFeedId = feedId;
  console.log('applying rule',rule.ruleDef.ruleId);
  violationCount = 0;
  async.eachSeries(rule.dataConstraints, this.applyDataConstraints, function(err){
    console.log(rule.ruleDef.ruleId + ' complete');
    ruleEngineCompletionCallback(violationCount);
  });
}

RuleHandler.prototype.applyDataConstraints = function (constraintSet, cb){
  if(RuleHandler.prototype.ruleInstance.type !== 'feedLevelRule'){

    async.eachSeries(constraintSet.entity, function(contraint, done) {
      var promises = [];
      //var streamObj =
      fetcher.applyConstraints( contraint, constraintSet.fields, RuleHandler.prototype.vipFeedId, RuleHandler.prototype.ruleInstance, function(fetchedData){

//        if(++streamObj.saveStackCount >= 10000) {
//          streamObj.isPaused = true;
//          streamObj.stream.pause();
//        }

        promises.push(RuleHandler.prototype.processDataResults( fetchedData.retrieveRule.ruleDef, fetchedData.entity, fetchedData.dataResults, constraintSet));

//        if(promise) {
//          promise.then(function() {
//            if(--streamObj.saveStackCount === 0 && streamObj.isPaused) {
//              streamObj.isPaused = false;
//              streamObj.stream.resume();
//            }
//          });
//        }
//        else {
//          if(--streamObj.saveStackCount === 0 && streamObj.isPaused) {
//            streamObj.isPaused = false;
//            streamObj.stream.resume();
//          }
//        }

      }, function() {
        when.all(promises).then(function() {
          done();
        });
      });

    }, function(err) { cb(); });

  }
  else {
    RuleHandler.prototype.processFeedLevelRule( RuleHandler.prototype.ruleInstance.ruleDef, RuleHandler.prototype.vipFeedId, constraintSet, cb );
  }
};


RuleHandler.prototype.processDataResults = function(ruleDef, entity, result, constraintSet){
  if(constraintSet.fields.length > 0) {
    var retPromise = null;

    for(var j = 0; j < constraintSet.fields.length; j++){
      var resultItem = formatNestedResult( constraintSet.fields[j], result );
      if(resultItem != null) {
        var promise = RuleHandler.prototype.processRule( ruleDef, resultItem, result, entity, constraintSet.fields[j] );

        if(j == 0)
          retPromise = promise;
        else
          retPromise = when.join(retPromise, promise);
      }
    }

   return retPromise;
  }
  else {
    if(result != null) {
      return RuleHandler.prototype.processRule( ruleDef, result, result, entity, constraintSet );
    }
    return null;
  }
};

function formatNestedResult(field, result){
  var resultItem = null;

  if(field.indexOf('.') > 0) {
    var nestedParam = field.split('.');
    resultItem = result[nestedParam[0]][nestedParam[1]];
  }
  else {
    resultItem = result[field];
  }

  return resultItem;
}

RuleHandler.prototype.processRule = function(ruleDef, dataItem, dataSet, entity, constraintSet){
  require(ruleDef.implementation).evaluate(dataItem, dataSet, entity, constraintSet, ruleDef, function(rule){
    if(rule.isViolated) {
      return RuleHandler.prototype.createViolation( rule.entity, rule.dataItem, rule.dataSet, rule.ruleDef );
    }

    return null;
  });
};

RuleHandler.prototype.processFeedLevelRule = function(ruleDef, feedId, constraintSet, cb){
  require(ruleDef.implementation).evaluate(feedId, constraintSet, ruleDef, function(rule){
    RuleHandler.prototype.addErrorViolations(rule.promisedErrorCount);
    cb();
  });
};

RuleHandler.prototype.addErrorViolations = function addErrorViolations(promisedErrorCount){
  if(promisedErrorCount){
    violationCount += promisedErrorCount;
  }
};

RuleHandler.prototype.createViolation = function createViolation(entity, dataItem, dataSet, ruleDef){
  var violation = new Violation(entity, dataSet.elementId, dataSet._id, dataSet._feed, dataSet, dataItem, ruleDef);
  violationCount++;
  return violation.getCollection().create(violation.model());
};

module.exports = RuleHandler;