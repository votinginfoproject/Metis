/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctEarlyVoteSite = function (models, feedId) {
    basemapper.call(this, models, feedId, models.precinctearlyvotesite);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctEarlyVoteSite, basemapper);

PrecinctEarlyVoteSite.prototype.mapCsv = function (precinctEarlyVoteSite) {
  this.model = {
    precinctId: precinctEarlyVoteSite.precinct_id,
    earlyVoteSiteId: precinctEarlyVoteSite.early_vote_site_id,
    _feed: this.feedId
  };
};

module.exports = PrecinctEarlyVoteSite;