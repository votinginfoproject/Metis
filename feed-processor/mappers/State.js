/**
 * Created by bantonides on 12/26/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  State = function (models, feedId) {
    basemapper.call(this, models, feedId, models.State);
  };
util.inherits(State, basemapper);

State.prototype.mapXml3_0 = function (state) {
  if (state.$ === undefined) {
    return;
  }

  this.model = new this.models.State({
    elementId: this.convertId(state.$.id),
    name: state.name,
    electionAdministrationId: this.convertId(state.election_administration_id),
    earlyVoteSiteIds: this.convertId(state.early_vote_site_id),
    _feed: this.feedId
  });
};

State.prototype.mapXml5_0 = function (state) {
  if (state.$ === undefined) {
    return;
  }

  this.model = new this.models.State({
    elementId: this.convertId(state.$.id),
    name: state.name,
    electionAdministrationId: this.convertId(state.election_administration_id),
    earlyVoteSiteIds: this.convertId(state.early_vote_site_id),
    abbreviation: state.abbreviation,
    region: state.region,
    _feed: this.feedId
  });
};

State.prototype.mapCsv = function (state) {
  this.model = new this.models.State({
    elementId: state.id,
    name: state.name,
    electionAdministrationId: state.election_administration_id,
    earlyVoteSiteIds: state.early_vote_site_id,
    _feed: this.feedId
  });
};


module.exports = State;
