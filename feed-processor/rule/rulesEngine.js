

var async = require('async');
var metisRuleHandler = require('./ruleHandler');
var ruleList = require('./ruleList');

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
  var totalErrorCount = 0;
  console.log(rules.length, 'Rules to apply');
  async.eachSeries(rules, function(rule, done){
    ruleHandler.applyRule(rule, vipFeedId, function(count) {
      totalErrorCount += count;
      console.log(count + ' errors added');
//      setTimeout(done, 1000);
      done();
    });
  }, function(err) {
    endSession(totalErrorCount);
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
