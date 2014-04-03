/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var feedIdMapper = require('../../feedIdMapper');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var async = require('async');
var when = require('when');
var moment = require('moment');

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
  schemas.models.Feed.findOne({_id: results[0]._feed}, function(err, feed) {

    schemas.models.Feed.findById(results[0]._feed, { payload: 0 })
      .populate('_state')
      .populate('_election')
      .exec(function(err, feed) {

        var title = "";

        // add feed date
        title += ( moment(feed._election.date).utc().format('YYYY-MM-DD') ? moment(feed._election.date).utc().format('YYYY-MM-DD') + "-" : "");
        // add feed state
        title += ( feed._state.name ? feed._state.name + "-" : "");
        // add feed electiontype
        title += ( feed._election.electionType ? feed._election.electionType + "-" : "");

        var completedOnDate = moment().utc();

        // pass in the date completed as time
        var friendlyId = feedIdMapper.makeFriendlyId(completedOnDate.valueOf(), title);

        // note: send is synchronous
        if (process.send) {
          // add the friendly id to the list of ids loaded into memory
          // tell the parent about the friendlyid of the current feed being processed to do this
          process.send({"messageId": 2, "friendlyId": friendlyId, "feedId": feed._id});
        }

        // now also save the friendly feed id
        schemas.models.Feed.update({_id: feed._id},
          {
            feedStatus: 'Complete',
            complete: true,
            completedOn: completedOnDate,
            friendlyId: friendlyId
          },
          function(err, feed) {

            // now close out the mongoose connection and exit the process
            mongoose.disconnect();
            process.exit();
          }
        );
      })
  });

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
