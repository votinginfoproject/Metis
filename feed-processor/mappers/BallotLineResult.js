/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  BallotLineResult = function (models, feedId) {
    basemapper.call(this, models, feedId, models.BallotLineResult);
  };
util.inherits(BallotLineResult, basemapper);

BallotLineResult.prototype.mapXml3_0 = function (ballotLineResult) {
  this.model = new this.models.BallotLineResult({
    elementId: ballotLineResult.$.id,     //required
    contestId: ballotLineResult.contest_id,
    jurisdictionId: ballotLineResult.jurisdiction_id,
    entireDistrict: this.convertYesNo(ballotLineResult.entire_district),
    candidateId: (!_.isEmpty(ballotLineResult.candidate_id)) ? _.first(ballotLineResult.candidate_id) : undefined,
    ballotResponseId: (!_.isEmpty(ballotLineResult.ballot_response_id)) ? _.first(ballotLineResult.ballot_response_id) : undefined,
    votes: ballotLineResult.votes,
    victorious: this.convertYesNo(ballotLineResult.victorious),
    certification: ballotLineResult.$.certification,
    _feed: this.feedId
  });
};

BallotLineResult.prototype.mapXml5_0 = function (ballotLineResult) {
  this.version = "v5";

  this.model = new this.models.BallotLineResult({
    elementId: ballotLineResult.$.id,     //required
    contestId: ballotLineResult.contest_id,
    referendumId: ballotLineResult.referendumId,
    jurisdictionId: ballotLineResult.jurisdiction_id,
    entireDistrict: this.convertYesNo(ballotLineResult.entire_district),
    candidateId: (!_.isEmpty(ballotLineResult.candidate_id)) ? _.first(ballotLineResult.candidate_id) : undefined,
    ballotResponseId: (!_.isEmpty(ballotLineResult.ballot_response_id)) ? _.first(ballotLineResult.ballot_response_id) : undefined,
    votes: ballotLineResult.votes,
    victorious: this.convertYesNo(ballotLineResult.victorious),
    voteType: ballotLineResult.vote_type,
    certification: ballotLineResult.$.certification,
    _feed: this.feedId
  });
};

BallotLineResult.prototype.mapCsv = function (ballotLineResult) {
  this.model = new this.models.BallotLineResult({
    elementId: ballotLineResult.id,     //required
    contestId: ballotLineResult.contest_id,
    jurisdictionId: ballotLineResult.jurisdiction_id,
    entireDistrict: this.convertYesNo(ballotLineResult.entire_district),
    candidateId: (!_.isEmpty(ballotLineResult.candidate_id)) ? _.first(ballotLineResult.candidate_id) : undefined,
    ballotResponseId: (!_.isEmpty(ballotLineResult.ballot_response_id)) ? _.first(ballotLineResult.ballot_response_id) : undefined,
    votes: ballotLineResult.votes,
    victorious: this.convertYesNo(ballotLineResult.victorious),
    certification: ballotLineResult.$.certification,
    _feed: this.feedId
  });
};


module.exports = BallotLineResult;
