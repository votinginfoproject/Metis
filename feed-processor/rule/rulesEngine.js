

var async = require('async');
var metisRuleHandler = require('./ruleHandler');
var ruleList = require('./rulelist');

var ruleHandler = new metisRuleHandler();
var rules = [];
var deferred = null;


function processRules(vipFeedId){
  deferred = require('when').defer();
  console.log('initializing rules..');
  async.each(ruleList, loadRule, function(err){
    console.log(rules.length, 'Metis rules loaded and staged for analysis');
    applyRules(vipFeedId, deferred);
  });
  return deferred.promise;
}

var loadRule = function(ruleDef, next){
  var activeState = false
  try {
    activeState = JSON.parse(ruleDef.isActive)
  }
  catch(err){ /* doNothing() */ }
  if(activeState) {
    console.log('loading...', ruleDef.ruleId);
    rules[rules.length] = ruleHandler.createRule(ruleDef);
  }
  next();
}

var applyRules = function(vipFeedId){
  console.log(rules.length, 'Rules to apply');
  async.each(rules, function(rule){
    ruleHandler.applyRule(rule, vipFeedId, endSession);
  });
}

var endSession = function(violationCount){
  console.log("Data analysis complete.")
  console.log(rules.length + " Rules applied");
  console.log(violationCount + " Rule errors created");
  console.log("Rules processor shutting down");
  deferred.resolve();
}


exports.processRules = processRules;
