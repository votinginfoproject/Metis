/**
 * Created by bantonides on 12/26/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  State = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(State, basemapper);

State.prototype.mapXml3_0 = function (state) {
  if (state.$ === undefined) {
    return;
  }

  this.model = new this.models.State({
    elementId: state.$.id,
    name: state.name,
    electionAdministrationId: state.election_administration_id,
    earlyVoteSiteIds: state.early_vote_site_id,
    _feed: this.feedId
  });
};

State.prototype.mapXml5_0 = function (state) {

};

State.prototype.mapCsv = function (state) {

};


module.exports = State;
