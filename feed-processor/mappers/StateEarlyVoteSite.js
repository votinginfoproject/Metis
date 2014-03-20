/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  StateEarlyVoteSite = function (models, feedId) {
    basemapper.call(this, models, feedId, models.StateEarlyVoteSite);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(StateEarlyVoteSite, basemapper);

StateEarlyVoteSite.prototype.mapCsv = function (stateEarlyVoteSite) {
  this.model = {
    stateId: stateEarlyVoteSite.state_id,
    earlyVoteSiteId: stateEarlyVoteSite.early_vote_site_id,
    _feed: this.feedId
  };
};

module.exports = StateEarlyVoteSite;