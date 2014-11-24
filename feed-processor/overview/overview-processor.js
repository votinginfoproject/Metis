/**
 * Created by rcartier13 on 2/5/14.
 */

var logger = (require('../../logging/vip-winston')).Logger;
var _fileName = "overview-processor";


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

var _ = require('underscore');

var overviewModels = [];
var functionArr = [];

function runOverviewProcessor(feedId) {
  // overview-processor as a whole (start)
  logger.profileSeparately(_fileName);

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
  logger.error(err);
  exitProcess(1);
}

function onSaveComplete(results) {
  // overview-processor as a whole (end)
  logger.profileSeparately(_fileName);

  logger.info('Shutting down overview processor');

  // just grab the feedid from any overview object
  // and set the feed to complete
  schemas.models.feeds.findOne({_id: results[0]._feed}, function(err, feed) {

    schemas.models.feeds.findById(results[0]._feed, { payload: 0 })
      .populate('_state')
      .populate('_election')
      .exec(function(err, feed) {

        var title = "";

        // add feed date
        title += ( feed._election && feed._election.date ? moment(feed._election.date).utc().format('YYYY-MM-DD') + "-" : "");
        // add feed state
        title += ( feed._state && feed._state.name ? feed._state.name + "-" : "");
        // add feed electiontype
        title += ( feed._election && feed._election.electionType ? feed._election.electionType + "-" : "");

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
        schemas.models.feeds.update({_id: feed._id},
          {
            feedStatus: 'Complete',
            complete: true,
            completedOn: completedOnDate,
            friendlyId: friendlyId
          },
          function(err, feed) {

            // now close out the mongoose connection and exit the process
            mongoose.disconnect();
            process.exit(0);
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

  if(overview.amount == undefined) {
    overviewModels.push(schemas.models.overview.create({
      elementType: name,
      amount: 0,
      errorCount: 0,
      section: section,
      _feed: feed
    }));
    return;
  }

  var pct = overview.schemaFieldCount !== 0 ? parseInt((overview.fieldCount / overview.schemaFieldCount) * 100) : 0;

  // Sometimes errors is NaN, or possibly "NaN", not sure what we can do except to convert to 0.
  var errorCount = +errors || 0;

  var create = {
    elementType: name,
    amount: overview.amount,
    completePct: pct,
    errorCount: errorCount,
    section: section,
    _feed: feed
  };
  overviewModels.push(schemas.models.overview.create(create));
};


function exitProcess(code){

  // now close out the mongoose connection and exit the process
  mongoose.disconnect();
  process.exit(code);
}

exports.runOverviewProcessor = runOverviewProcessor;
