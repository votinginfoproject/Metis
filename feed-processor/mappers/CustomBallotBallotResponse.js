/**
 * Created by bantonides on 3/11/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  CustomBallotBallotResponse = function (models, feedId) {
    basemapper.call(this, models, feedId, models.customballotballotresponse);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(CustomBallotBallotResponse, basemapper);

CustomBallotBallotResponse.prototype.mapCsv = function (customBallotBallotResponse) {
  this.model = {
    customBallotId: customBallotBallotResponse.custom_ballot_id,
    ballotResponseId: customBallotBallotResponse.ballot_response_id,
    sortOrder: customBallotBallotResponse.sort_order,
    _feed: this.feedId
  };
};

module.exports = CustomBallotBallotResponse;