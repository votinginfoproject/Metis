

var async = require('async');
var metisRuleHandler = require('./ruleHandler');
var ruleList = require('./ruleList');

var ruleHandler = new metisRuleHandler();
var deferred = null;


function processRules(vipFeedId){
  deferred = require('when').defer();
  console.log('initializing rules..');

  var rules = [];
  // Loops through the rule list creating a new rule for each entry.
  ruleList.forEach(function(rule) {

    if(rule.isActive) {
      console.log('loading...', rule.ruleId);
      rules.push(ruleHandler.createRule(rule));
    }

  });

  console.log(rules.length, 'Metis rules loaded and staged for analysis');
  applyRules(vipFeedId, rules);
  return deferred.promise;
}

var applyRules = function(vipFeedId, rules){
  var totalErrorCount = 0;
  console.log(rules.length, 'Rules to apply');

  // Loop through each rule, applying them one at a time so that it can conserve on memory
  async.eachSeries(rules, function(rule, done) {

    ruleHandler.applyRule(rule, vipFeedId, function(count) {
      totalErrorCount += count;
      console.log(count + ' errors added');
      done();
    });

  },
  function(err) {

    if(err) { /* TODO: add winston logging for something breaking in the rule handler */ }

    console.log("Data analysis complete.");
    console.log(rules.length + " Rules applied");
    console.log(totalErrorCount + " Rule errors created");
    console.log("Rules processor shutting down");
    deferred.resolve();

  });
};

exports.processRules = processRules;
