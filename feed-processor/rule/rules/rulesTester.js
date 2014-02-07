/**
 * Created by bantonides on 1/22/14.
 */

  /*
var config = require('../../../config');
var mongoose = require('mongoose');
var schemas = require('../../../dao/schemas');
var db;

initiateRuleTesting();

function connectMongo(connectionString, next) {
  mongoose.connect(connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
    next();
  });
};

function initiateRuleTesting() {
  schemas.initSchemas(mongoose);

  connectMongo(config.mongoose.connectionString, function () {
    var rulesList = require('./rulesList').rules;

    rulesList.forEach(function(rule) {
      require(rule.ruleImplementation).runCheck(schemas.models, '52f254011beffbf731c92a93', rule);
      console.log('Rule complete.');
    });
    console.log('End initRuleTesting.');
  });
};
*/

function RulesTester(models) {
  this.models = models;
}

RulesTester.prototype.run = function(feedId) {
  var rulesList = require('./rulesList').rules;

  var self = this;
  var r = [];

  rulesList.forEach(function(rule) {
    r.push(require(rule.ruleImplementation).runCheck.bind(undefined, self.models, feedId, rule));
  });

  var async = require('async');
  async.series(r, exit);

  console.log('End initRuleTesting.');
};

function exit() {
  console.log('exiting...');
  process.exit();
}

module.exports = RulesTester;