/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  LocalityEarlyVoteSite = function (models, feedId) {
    basemapper.call(this, models, feedId, models.LocalityEarlyVoteSite);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(LocalityEarlyVoteSite, basemapper);

LocalityEarlyVoteSite.prototype.mapCsv = function (localityEarlyVoteSite) {
  this.model = {
    localityId: localityEarlyVoteSite.locality_id,
    earlyVoteSiteId: localityEarlyVoteSite.early_vote_site_id,
    _feed: this.feedId
  };
};

module.exports = LocalityEarlyVoteSite;