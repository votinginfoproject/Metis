/**
 * Created by nboseman on 12/23/13.
 */

var uniqueIdRule = require('./uniqueIdRule');
var urlFormatRule = require('./urlrule');



/* begin rule processing below */

function processRules(){
  ruleCollection = [];

  //MetisRule 1: Check for uniqueness of IDs in the collection set
  var uniqueIDCheck = new uniqueIdRule();
  ruleCollection.push(uniqueIDCheck);

  //MetisRule 2: Retrieve all url-bound constraints from the rule def, verify they are valid
  var validUrlCheck = new urlFormatRule();
  ruleCollection.push(validUrlCheck);

  return ruleCollection;
}

function analyzeRules(vipFeedId){
  processRules().forEach(function(rule){
    rule.evaluate(vipFeedId);
  });
}


var analyzeRule = function(rule, cb){
  rule.evaluate("", cb);
}

var endSession = function(){
 console.log("Data analysis complete. Processor shutting down.");
 process.exit();
}

function processSet(){
  require('async').eachSeries(processRules(), analyzeRule, endSession)
}



exports.analyzeRules = processSet;