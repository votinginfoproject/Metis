/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var async = require('async');
var when = require('when');

var contests = require('./contests');
var results = require('./results');
var contest = require('./contest');
var locality = require('./locality');
var pollinglocations = require('./pollinglocations');

var overviewModels = [];
var functionArr = [];

function runOverviewProcessor(feedId) {

  functionArr.push(pollinglocations.kickoffPollingLoc);
  functionArr.push(contests.kickoffContest);
  functionArr.push(results.kickoffResults);
  functionArr.push(contest.kickoffContest);
  functionArr.push(locality.kickoffLocality);

  calculateFields(feedId, function() {
    when.all(overviewModels).then(onSaveComplete, errorHandler);
  });
}

function errorHandler(err) {
  console.error(err);
}

function onSaveComplete(results) {
  console.log("Shutting down overview processor");

  // just grab the feedid from any overview object
  // and set the feed to complete
  schemas.models.Feed.update({_id: results[0]._feed}, { feedStatus: 'Complete', complete: true, completedOn: new Date() },
    function(err, feed) {

      // now close out the mongoose connection and exit the process
      mongoose.disconnect();
      process.exit();
    }
  );

}

function calculateFields(feedId, saveCalc) {
  async.eachSeries(functionArr, function(func, done) {
    func(feedId, createOverviewModel, done);
  }, saveCalc);
};

function createOverviewModel(name, overview, errors, section, feed) {
  overviewModels.push(schemas.models.Overview.create({
    elementType: name,
    amount: overview.amount,
    completePct: overview.schemaFieldCount !== 0 ? parseInt((overview.fieldCount / overview.schemaFieldCount) * 100) : 0,
    errorCount: errors,
    section: section,
    _feed: feed
  }));
};

exports.runOverviewProcessor = runOverviewProcessor;
