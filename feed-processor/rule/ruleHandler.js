
var fetcher = require('./datafetcher');
var Violation = require('./ruleviolation');
var ActiveRuleStats =require('./ruleObserver');
var violations = [];


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
  return new Rule(ruleDef);
}

RuleHandler.prototype.applyRule = function(rule, feedId, ruleEngineCompletionCallback){
  console.log(rule.title, "is being applied");
  ActiveRuleStats.applyRule(rule.ruleDef);
  RuleHandler.prototype.ruleInstance = rule;
  RuleHandler.prototype.vipFeedId = feedId;

  async.each(rule.dataConstraints, this.applyDataConstraints,
    function(err){console.log('rule application complete');
      ruleEngineCompletionCallback();
  });
}

RuleHandler.prototype.applyDataConstraints = function (constraintSet, cb){

  //TODO: Make this a case statement
  if(RuleHandler.prototype.ruleInstance.type != 'feedLevelRule'){
    for(p=0; p < constraintSet.entity.length; p++){
      fetcher.applyConstraints(constraintSet.entity[p], constraintSet.fields, RuleHandler.prototype.vipFeedId, RuleHandler.prototype.ruleInstance).then(
        function(fetchedData){
          RuleHandler.prototype.processDataResults(fetchedData.retrieveRule.ruleDef, fetchedData.entity, fetchedData.dataResults, constraintSet, cb);
        },
        function(err){
          console.log('In applyDataConstraints()', err);
        }
      );
    }
  }
  else {
    RuleHandler.prototype.processFeedLevelRule(RuleHandler.prototype.ruleInstance.ruleDef, RuleHandler.prototype.vipFeedId, constraintSet, cb);
  }
}


RuleHandler.prototype.processDataResults = function(ruleDef, entity, results, constraintSet, cb){
  for(i = 0; i < results.length; i++){
    result = results[i];
    if(constraintSet.fields.length > 0) {
      for(j=0; j < constraintSet.fields.length; j++){
        field = constraintSet.fields[j];
        if(result[field] != null) {
          RuleHandler.prototype.processRule(ruleDef, result[field], result, entity, constraintSet, cb);
        }
      }
    }
    else {
      if(result != null){
        RuleHandler.prototype.processRule(ruleDef, result, result, entity, constraintSet, cb);
      }
    }
  }
}


RuleHandler.prototype.processRule = function(ruleDef, dataItem, dataSet, entity, constraintSet, cb){
  ActiveRuleStats.increaseRuleCount(ruleDef);
  //console.log(ActiveRuleStats.statusRuleCount());
  fn.call(require(ruleDef.implementation).evaluate, dataItem, dataSet, entity, constraintSet, ruleDef)
    .then(function(rule){

      if(rule.isViolated){
        RuleHandler.prototype.createViolation(rule.entity, rule.dataItem, rule.dataSet, rule.ruleDef);
      }
      ActiveRuleStats.decreaseRuleCount(ruleDef);
      //console.log(ActiveRuleStats.statusRuleCount());
      if(ActiveRuleStats.atTerminalState())
        cb();
    },
    function(error){
      console.log('Error: ', error.message);
    }
  );
}

RuleHandler.prototype.processFeedLevelRule = function(ruleDef, feedId, constraintSet, cb){
  ActiveRuleStats.increaseRuleCount(ruleDef);
  //console.log(ActiveRuleStats.statusRuleCount());
  fn.call(require(ruleDef.implementation).evaluate, feedId, constraintSet, ruleDef)
    .then(function(rule){

      if(rule.errorList != null){
        RuleHandler.prototype.addErrorViolations(rule.errorList);
      }
      ActiveRuleStats.decreaseRuleCount(ruleDef);
      //console.log(ActiveRuleStats.statusRuleCount());
      if(ActiveRuleStats.atTerminalState())
        cb();
    },
    function(error){
      console.log('Error in processFeedLevelRule(): ', error.message);
    }
  );
}

RuleHandler.prototype.addErrorViolations = function addErrorViolations(errorList){
  for(i = 0; i < errorList.length; i++){
    violation = new Violation();
    violations[violations.length] = errorList[i];
    violation.createModel(errorList[i]);
  }
}

RuleHandler.prototype.createViolation = function createViolation(entity, dataItem, dataSet, ruleDef){
  violation = new Violation(entity, dataSet.elementId, dataSet._id, dataSet._feed, dataSet, dataItem, ruleDef);
  violations[violations.length] = violation;
  ActiveRuleStats.logRuleViolation();
  violation.save();
}

module.exports = RuleHandler;