/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  BallotResponse = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(BallotResponse, basemapper);

BallotResponse.prototype.mapXml3_0 = function (ballotResponse) {
  this.model = new this.models.BallotResponse({
    elementId: ballotResponse.$.id,     //required
    text: ballotResponse.text,
    sortOrder: ballotResponse.sort_order,
    _feed: this.feedId
  });
};

BallotResponse.prototype.mapXml5_0 = function (ballotResponse) {

};

BallotResponse.prototype.mapCsv = function (ballotResponse) {

};


module.exports = BallotResponse;
