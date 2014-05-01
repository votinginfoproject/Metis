/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Ballot = function (models, feedId) {
    basemapper.call(this, models, feedId, 'Ballot');
  };
util.inherits(Ballot, basemapper);

Ballot.prototype.mapXml3_0 = function (ballot) {

  this.model = new this.models.Ballot({
    elementId: ballot.$.id,     //required
    referendumIds: _.map(ballot.referendum_id, function(ref) {
      return {
        elementId: (ref.$text === undefined) ? ref : ref.$text,
        sortOrder: (ref.$ === undefined) ? undefined : ref.$.sort_order
      }
    }),
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
  this.version = "v5";

  this.model = new this.models.Ballot({
    elementId: ballot.$.id,     //required
    contestIds: _.map(ballot.contest_id, function(contest) {
      return {
        elementId: (contest.$text === undefined) ? contest : contest.$text,
        sortOrder: (contest.$ === undefined) ? undefined : contest.$.sort_order
      }
    }),
    referendumIds: _.map(ballot.referendum_id, function(ref) {
      return {
        elementId: (ref.$text === undefined) ? ref : ref.$text,
        sortOrder: (ref.$ === undefined) ? undefined : ref.$.sort_order
      };
    }),
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

Ballot.prototype.mapCsv = function (ballot) {
  this.model = new this.models.Ballot({
    elementId: ballot.id,     //required
    referendumIds: _.map(ballot.referendum_id, function(ref) {
      return {
        elementId: (ref.$text === undefined) ? ref : ref.$text,
        sortOrder: (ref.$ === undefined) ? undefined : ref.$.sort_order
      }
    }),
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
