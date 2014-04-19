/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Ballot = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Ballot);
  };
util.inherits(Ballot, basemapper);

Ballot.prototype.mapXml3_0 = function (ballot) {
  // TODO: Figure out if this is actually supposed to be an array or not in v3.0
  var refIds = ballot.referendum_id;

  if(ballot.referendum_id && ballot.referendum_id.length) {
    refIds = _.map(ballot.referendum_id, function(ref) {
      return {
        elementId: (ref.$text === undefined) ? ref : this.convertId(ref.$text),
        sortOrder: (ref.$ === undefined) ? undefined : ref.$.sort_order
      };
    })
  }

  this.model = new this.models.Ballot({
    elementId: this.convertId(ballot.$.id),     //required
    referendumIds: refIds,
    candidates: _.map(ballot.candidate_id, function(candidate) {
      return {
        elementId: (candidate.$text === undefined) ? candidate : this.convertId(candidate.$text),
        sortOrder: (candidate.$ === undefined) ? undefined : candidate.$.sort_order
      };
    }),
    customBallotId: this.convertId(ballot.custom_ballot_id),
    writeIn: this.convertYesNo(ballot.write_in),
    imageUrl: ballot.image_url,
    _feed: this.feedId
  });
};

Ballot.prototype.mapXml5_0 = function (ballot) {

};

Ballot.prototype.mapCsv = function (ballot) {
  this.model = new this.models.Ballot({
    elementId: ballot.id,     //required
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


module.exports = Ballot;
