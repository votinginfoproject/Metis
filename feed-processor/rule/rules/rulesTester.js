/**
 * Created by bantonides on 1/22/14.
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