/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  ContestResult = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(ContestResult, basemapper);

ContestResult.prototype.mapXml3_0 = function (contestResult) {
  this.model = new this.models.ContestResult({
    elementId: contestResult.$.id,     //required
    contestId: contestResult.contest_id,
    jurisdictionId: contestResult.jurisdiction_id,
    entireDistrict: this.convertYesNo(contestResult.entire_district),
    totalVotes: contestResult.total_votes,
    totalValidVotes: contestResult.total_valid_votes,
    overvotes: contestResult.overvotes,
    blankVotes: contestResult.blank_votes,
    acceptedProvisionalVotes: contestResult.accepted_provisional_votes,
    rejectedVotes: contestResult.rejected_votes,
    certification: contestResult.$.certification,
    _feed: this.feedId
  });
};

ContestResult.prototype.mapXml5_0 = function (contestResult) {

};

ContestResult.prototype.mapCsv = function (contestResult) {

};


module.exports = ContestResult;
