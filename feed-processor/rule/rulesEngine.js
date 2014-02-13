

var async = require('async');
var metisRuleHandler = require('./metisrule');
var ruleList = require('./rulelist');

var ruleHandler = new metisRuleHandler();
var rules = [];


function processRules(vipFeedId){
  console.log('initializing rules..');
  async.each(ruleList, loadRule, function(err){
    console.log(rules.length, 'Metis rules loaded and staged for analysis');
    applyRules(vipFeedId);
  });
}

var loadRule = function(ruleDef, next){
  console.log('loading rule..', ruleDef.title);
  rules[rules.length] = ruleHandler.createRule(ruleDef);
  next();
}

var applyRules = function(vipFeedId){
  console.log(rules.length, 'Rules to apply');
  async.each(rules, function(rule){
    ruleHandler.applyRule(rule, vipFeedId, endSession);
  });
}


var endSession = function(){
  console.log("Data analysis complete. Processor shutting down");
  process.exit();
}

exports.processRules = processRules;
