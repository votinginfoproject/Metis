/**
 * Created by bantonides on 3/6/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  VaveBallotCandidate = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(VaveBallotCandidate, basemapper);

VaveBallotCandidate.prototype.mapCsv = function (ballotCandidate) {
  this.model = new this.models.BallotCandidate({
    ballotId: ballotCandidate.ballot_id,
    candidateId: ballotCandidate.candidate_id,
    sortOrder: ballotCandidate.sort_order,
    _feed: this.feedId
  });
};

module.exports = VaveBallotCandidate;