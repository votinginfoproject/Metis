/**
 * Created by rcartier13 on 4/22/14.
 */

const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  BallotStyle = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Ballot);
  };
util.inherits(BallotStyle, basemapper);

BallotStyle.prototype.mapXml5_0 = function (ballotStyle) {
  this.model = new this.models.BallotStyle({
    elementId: ballotStyle.$.id,
    name: ballotStyle.name,
    electionId: ballotStyle.election_id,
    contestId: ballotStyle.contest_id,
    referendumId: ballotStyle.referendum_id,
    sortOrder: ballotStyle.$.sort_order,
    candidateId: {
      elementId: (ballotStyle.candidate_id.$text === undefined) ? ballotStyle.candidate_id : this.convertId(ballotStyle.candidate_id.$text),
      sortOrder: (ballotStyle.candidate_id.$ === undefined) ? undefined : ballotStyle.candidate_id.$.sort_order
    }
  });
};

module.exports = BallotStyle;