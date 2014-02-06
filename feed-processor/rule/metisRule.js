
var constraints = require('./dataconstraints');
var fetcher = require('./datafetcher');
var Violation = require('./ruleviolation');
var violations = [];
var activeRules = {};
/*
 var ActiveRuleStats = {
 increaseRuleCount: function(ruleDef){
 activeRules[ruleDef.title] = activeRules[ruleDef.title] + 1;
 },
 decreaseRuleCount: function(ruleDef){
 activeRules[ruleDef.title] = activeRules[ruleDef.title].length - 1;
 },
 statusRuleCount: function(){
 return activeRules;
 }
 };
 */

var async = require('async');
var fn = require('when/function');
var when = require('when');


function Rule(ruleDef){
  this.implementation = ruleDef.implementation;
  this.description = ruleDef.severityText;
  this.title = ruleDef.title;
  this.ruleDef = ruleDef;
  this.dataConstraints = constraints[ruleDef.title];
}

function MetisRule() {}

MetisRule.prototype.mRule = Rule;
MetisRule.prototype.ruleInstance = Rule;
MetisRule.prototype.MRuleStats= { activeRuleCount: 0 };

MetisRule.prototype.createRule = function(ruleDef){
  this.mRule = Rule;
  this.ruleInstance = new this.mRule(ruleDef);
  MetisRule.prototype.ruleInstance = this.ruleInstance;
  return this.ruleInstance;
}


MetisRule.prototype.applyRule = function(rule, cb){
  console.log(rule.title, "is being applied");
  MetisRule.prototype.ruleInstance = rule;
  async.each(constraints[rule.title], this.applyDataConstraints, function(err){console.log(rule.title, 'rule application complete');cb();});
}

MetisRule.prototype.applyDataConstraints = function (constraintSet, cb){
  for(p=0; p < constraintSet.entity.length; p++){
    fetcher.applyConstraints(constraintSet.entity[p], constraintSet.fields, "", MetisRule.prototype.ruleInstance).then(
      function(fetchedData){
        fetchedData.resolveEntityData.then(
          function(results){
            MetisRule.prototype.processDataResults(fetchedData.retrieveRule.ruleDef, fetchedData.entity, results, constraintSet, cb);
          },
          function(err){
            console.log('Error: inner promise for applyDataConstraints()');
            console.log(err.message);
          });
      },
      function(err){
        console.err('Error in outer promise for applyDataConstraints()', err);
      }
    );
  }
}


MetisRule.prototype.processDataResults = function(ruleDef, entity, results, constraintSet, cb){
  for(i = 0; i < results.length; i++){
    result = results[i];
    if(constraintSet.fields.length > 0) {
      for(j=0; j < constraintSet.fields.length; j++){
        field = constraintSet.fields[j];
        if(result[field] != null) {
          MetisRule.prototype.processRule(ruleDef, result[field], result, entity, constraintSet, cb);
        }
      }
    }
    else {
      if(result != null){
        MetisRule.prototype.processRule(ruleDef, result, result, entity, constraintSet, cb);
      }
    }
  }
}

MetisRule.prototype.processRule = function(ruleDef, dataItem, dataSet, entity, constraintSet, cb){
  //ActiveRuleStats.increaseRuleCount(ruleDef);
  fn.call(require(ruleDef.implementation).evaluate, dataItem, dataSet, entity, constraintSet, ruleDef)
    .then(function(rule){
      //ActiveRuleStats.decreaseRuleCount(ruleDef);
      //console.log(MRuleStats.activeRuleCount);
      if(rule.isViolated){
        MetisRule.prototype.createViolation(rule.entity, rule.dataItem, rule.dataSet, ruleDef);
        console.log('Violation Count:', violations.length);
        //console.log(ActiveRuleStats.statusRuleCount());
      }
    },
    function(error){
      console.log('Error: in analyzeData()', error.message);
    }
  );
  //cb();
}


MetisRule.prototype.createViolation = function createViolation(entity, dataItem, dataSet, ruleDef){
  violation = new Violation(entity, dataSet.elementId, dataSet._id, dataSet._feed, dataSet, dataItem, ruleDef);
  violations[violations.length] = violation;
  //console.log('Violation:', violation);
}

module.exports = MetisRule;