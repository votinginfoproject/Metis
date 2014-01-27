/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Ballot = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(Ballot, basemapper);

Ballot.prototype.mapXml3_0 = function (ballot) {
  this.model = new this.models.Ballot({
    elementId: ballot.$.id,     //required
    referendumIds: ballot.referendum_id,
    candidates: _.map(ballot.candidate_id, function(candidate) {
      return {
        elementId: (candidate.$text === undefined) ? candidate : candidate.$text,
        sortOrder: (candidate.$ === undefined) ? undefined : candidate.$.sort_order
      };
    }),
    customBallotId: ballot.custom_ballot_id,
    writeIn: this.convertYesNo(ballot.write_in),
    imageUrl: ballot.image_url,
    _feed: this.feedId
  });
};

Ballot.prototype.mapXml5_0 = function (ballot) {

};

Ballot.prototype.mapCsv = function (ballot) {

};


module.exports = Ballot;
