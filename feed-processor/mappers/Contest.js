/**
 * Created by bantonides on 12/27/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  Contest = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Contest);
  };
util.inherits(Contest, basemapper);

Contest.prototype.mapXml3_0 = function (contest) {
  this.model = new this.models.Contest({
    elementId: contest.$.id,     //required
    electionId:  contest.election_id,
    electoralDistrictId:  contest.electoral_district_id[0],
    type: contest.type,
    partisan: this.convertYesNo(contest.partisan),
    primaryParty: contest.primary_party,
    electorateSpecifications: contest.electorate_specifications,
    special: this.convertYesNo(contest.special),
    office: contest.office,
    filingClosedDate: contest.filing_closed_date,
    numberElected:  contest.number_elected,
    numberVotingFor: contest.number_voting_for,
    ballotId: contest.ballot_id,
    ballotPlacement: contest.ballot_placement,
    _feed: this.feedId
  });
};

Contest.prototype.mapXml5_0 = function (contest) {

};

Contest.prototype.mapCsv = function (contest) {
  this.model = new this.models.Contest({
    elementId: contest.id,     //required
    electionId:  contest.election_id,
    electoralDistrictId:  contest.electoral_district_id[0],
    type: contest.type,
    partisan: this.convertYesNo(contest.partisan),
    primaryParty: contest.primary_party,
    electorateSpecifications: contest.electorate_specifications,
    special: this.convertYesNo(contest.special),
    office: contest.office,
    filingClosedDate: contest.filing_closed_date,
    numberElected:  contest.number_elected,
    numberVotingFor: contest.number_voting_for,
    ballotId: contest.ballot_id,
    ballotPlacement: contest.ballot_placement,
    _feed: this.feedId
  });
};


module.exports = Contest;
