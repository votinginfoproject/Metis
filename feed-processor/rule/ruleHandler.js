
var logger = (require('../../vip-winston')).Logger;
var fetcher = require('./dataFetcher');
var Violation = require('./ruleViolation');
var violationCount = 0;


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
};

RuleHandler.prototype.applyRule = function(rule, feedId, ruleEngineCompletionCallback){

  // Set globals for the rule
  RuleHandler.prototype.ruleInstance = rule;
  RuleHandler.prototype.vipFeedId = feedId;
  violationCount = 0;
  logger.info('starting rule: ' + rule.ruleDef.ruleId);

  // Loop through the list of constraints for this rule
  async.eachSeries(rule.dataConstraints, this.applyDataConstraints, function(err){
    logger.info(rule.ruleDef.ruleId + ' completed');

    ruleEngineCompletionCallback(violationCount);
  });
};

RuleHandler.prototype.applyDataConstraints = function (constraintSet, cb){
  if(RuleHandler.prototype.ruleInstance.type !== 'feedLevelRule'){

    // Loop through entities in the constraint set in order to avoid having two streams running at once.
    async.eachSeries(constraintSet.entity, function(contraint, done) {
      var promises = [];
      // Starts the stream and calls the first call back every time it gets a document back from MongoDB
      var streamObj = fetcher.applyConstraints( contraint, constraintSet.fields, RuleHandler.prototype.vipFeedId, RuleHandler.prototype.ruleInstance, function(fetchedData){

        // If it is one of the two end states make sure that all the promises are finished saving before starting the next save
        if(fetchedData == -1 || fetchedData == null) {
          when.all(promises).then(function() {
            done();
          });
          return;
        }

        // Sends the data to the rule to be checked and saved if it is an error
        var promise = RuleHandler.prototype.processDataResults( fetchedData.retrieveRule.ruleDef, fetchedData.entity, fetchedData.dataResults, constraintSet);
        promises.push(promise);

        if(promise) {
          // If too many objects are ing the que to be saved at once pause the stream
          if(++streamObj.saveStackCount >= 10000) {
            streamObj.isPaused = true;
            streamObj.stream.pause();
          }

          // Wait for the promise to come back before decrementing the save counter and possibly resuming the stream.
          promise.then(function() {
            if(--streamObj.saveStackCount === 0 && streamObj.isPaused) {
              streamObj.isPaused = false;
              streamObj.stream.resume();
            }
          });
        }
      });
    },
    function() {
      // when the loop finishes let the rules engine to start the next rule.
      cb();
    });
  }
  else {
    RuleHandler.prototype.processFeedLevelRule( RuleHandler.prototype.ruleInstance.ruleDef, RuleHandler.prototype.vipFeedId, constraintSet, cb );
  }
};


RuleHandler.prototype.processDataResults = function(ruleDef, entity, result, constraintSet) {
  if(constraintSet.fields.length > 0) {
    var retPromise = null;

    // Loop through the fields and create a promise to return to the main loop
    constraintSet.fields.forEach(function(field, index) {
      var resultItem = formatNestedResult( field, result );

      if(resultItem != null) {
        var promise = RuleHandler.prototype.processRule( ruleDef, resultItem, result, entity, field );

        if(index == 0)
          retPromise = promise;
        else
          retPromise = when.join(retPromise, promise);
      }
    });

   return retPromise;
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
  require(ruleDef.implementation).evaluate(dataItem, dataSet, entity, constraintSet, ruleDef, function(rule) {

    if(rule.isViolated) {
      return RuleHandler.prototype.createViolation( rule.entity, rule.dataItem, rule.dataSet, rule.ruleDef );
    }

    return null;
  });
};

RuleHandler.prototype.processFeedLevelRule = function(ruleDef, feedId, constraintSet, cb) {
  require(ruleDef.implementation).evaluate(feedId, constraintSet, ruleDef, function(rule) {
    if(rule.promisedErrorCount){
      violationCount += rule.promisedErrorCount;
    }
    cb();
  });
};

RuleHandler.prototype.createViolation = function createViolation(entity, dataItem, dataSet, ruleDef){
  var violation = new Violation(entity, dataSet.elementId, dataSet._id, dataSet._feed, dataSet, dataItem, ruleDef);
  violationCount++;
  return violation.getCollection().create(violation.model());
};

module.exports = RuleHandler;