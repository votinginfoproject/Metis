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
    sortOrder: ballotStyle.$.sort_order,
    contestIds: _.map(ballotStyle.contest, function(contest) {
      return {
        ballotId: contest.ballot_id,
        contestOrder: contest.contest_order,
        contestId: contest.contest_id,
        candidateIds: _.map(contest.candidates, function (candidate) {
          return {
            sortOrder: candidate.sort_order,
            candidateId: candidate.candidate_id
          }
        })
      }
    })
  });
};

module.exports = BallotStyle;