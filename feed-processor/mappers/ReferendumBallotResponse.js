/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  ReferendumBallotResponse = function (models, feedId) {
    basemapper.call(this, models, feedId, models.referendumballotresponse);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(ReferendumBallotResponse, basemapper);

ReferendumBallotResponse.prototype.mapCsv = function (referendumBallotResponse) {
  this.model = {
    referendumId: referendumBallotResponse.referendum_id,
    ballotResponseId: referendumBallotResponse.ballot_response_id,
    sortOrder: referendumBallotResponse.sort_order,
    _feed: this.feedId
  };
};

module.exports = ReferendumBallotResponse;