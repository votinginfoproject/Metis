

var logger = (require('../../vip-winston')).Logger;
var async = require('async');
var metisRuleHandler = require('./ruleHandler');
var ruleList = require('./ruleList');

var ruleHandler = new metisRuleHandler();
var deferred = null;


function processRules(vipFeedId){
  deferred = require('when').defer();
  logger.info('=========================================');
  logger.info('Initializing Rules Engine');
  logger.info('=========================================');

  var rules = [];
  // Loops through the rule list creating a new rule for each entry.
  ruleList.forEach(function(rule) {

    if(rule.isActive) {
      logger.info('loaded: ' + rule.ruleId);
      rules.push(ruleHandler.createRule(rule));
    }

  });

  logger.info('---------------------------------------');
  logger.info(rules.length + ' Metis rules loaded and ready to be processed.');
  logger.info('---------------------------------------');
  applyRules(vipFeedId, rules);
  return deferred.promise;
}

var applyRules = function(vipFeedId, rules){
  var totalErrorCount = 0;

  // Loop through each rule, applying them one at a time so that it can conserve on memory
  async.eachSeries(rules, function(rule, done) {

    ruleHandler.applyRule(rule, vipFeedId, function(count) {
      totalErrorCount += count;
      logger.info(count + ' errors created');
      logger.info('---------------------------------------');
      done();
    });

  },
  function(err) {

    if(err) { logger.error('ERROR: Problem with applying rule', err); }

    logger.info("Rules Processing completed:");
    logger.info(rules.length + " rules have been processed");
    logger.info(totalErrorCount + " total errors created");
    logger.info('Rules Processor shutting down');
    logger.info('---------------------------------------');
    deferred.resolve();

  });
};

exports.processRules = processRules;
