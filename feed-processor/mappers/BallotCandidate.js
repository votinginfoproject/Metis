/**
 * Created by bantonides on 3/6/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  BallotCandidate = function (models, feedId) {
    basemapper.call(this, models, feedId, models.ballotcandidate);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(BallotCandidate, basemapper);

BallotCandidate.prototype.mapCsv = function (ballotCandidate) {
  this.model = {
    ballotId: ballotCandidate.ballot_id,
    candidateId: ballotCandidate.candidate_id,
    sortOrder: ballotCandidate.sort_order,
    _feed: this.feedId
  };
};

module.exports = BallotCandidate;