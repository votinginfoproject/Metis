/**
 * Created by nboseman on 12/23/13.
 */

var db;
var schemas = require('../../dao/schemas');
var mongoose = require('mongoose');
var uniqueIdRule = require('./uniqueIdRule');
var urlFormatRule = require('./urlrule');
schemas.initSchemas(mongoose);


  mongoose.connect(require('../../config').mongoose.connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
  });


var violationSchema = {
  element_name: String,
  member_name: String,
  description: String,
  objectId: String,
  feedId: String
};
mongoose.model("violations", mongoose.Schema(violationSchema)); //TODO: config forinitViolationsSchema();

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
    console.log("Processing rule..");
    rule.evaluate(vipFeedId);
  });
}

exports.analyzeRules = analyzeRules;