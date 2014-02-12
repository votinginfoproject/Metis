
var metisRule = require('./metisrule');
var ruleList = require('./rulelist');

var async = require('async');
var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');

var rules = [];
var ruleHandler = new metisRule();


var processRules = function(vipFeedId){
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

/*  for external testing */

function connectMongo(connectionString, next) {
  mongoose.connect(connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
    next();
  });
}

function executeProg(vipFeedId) {
  schemas.initSchemas(mongoose);
  connectMongo(config.mongoose.connectionString, function () {
    processRules(vipFeedId);
  });
}

executeProg(process.argv[2]);