/**
 * Created by rcartier13 on 4/22/14.
 */

const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  BallotStyle = function (models, feedId) {
    basemapper.call(this, models, feedId, models.ballotstyles);
  };
util.inherits(BallotStyle, basemapper);

BallotStyle.prototype.mapXml5_0 = function (ballotStyle) {
  this.version = "v5";

  this.model = new this.models.ballotstyles({
    elementId: ballotStyle.$.id,
    name: ballotStyle.name,
    electionId: ballotStyle.election_id,
    referendumId: ballotStyle.referendum_id,
    sortOrder: ballotStyle.$.sort_order ? ballotStyle.sort_order : null,
    contestIds: _.map(ballotStyle.contest, function(contest) {
      return {
        ballotId: contest.ballot_id,
        contestOrder: contest.$.contest_order ? contest.$.contest_order : null,
        contestId: contest.$.contest_id ? contest.$.contest_id : null,
        candidateIds: _.map(contest.candidates, function (candidate) {
          return {
            sortOrder: candidate.$.sort_order ? candidate.$.sort_order : null,
            candidateId: candidate.$.candidate_id ? candidate.$.candidate_id : null
          }
        })
      }
    }),
    _feed: this.feedId
  });
};

module.exports = BallotStyle;