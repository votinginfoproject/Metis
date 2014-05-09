/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  types = require('mongoose').Types,
  _ = require('underscore'),
  Precinct = function (models, feedId) {
    basemapper.call(this, models, feedId, models.precincts);
  };
util.inherits(Precinct, basemapper);

Precinct.prototype.mapXml3_0 = function (precinct) {
  this.model = new this.models.precincts({
    _id: types.ObjectId(),
    elementId: precinct.$.id,     //required
    name: precinct.name,
    number: precinct.number,
    localityId: precinct.locality_id,
    electoralDistrictIds: precinct.electoral_district_id,
    ward: precinct.ward,
    mailOnly: this.convertYesNo(precinct.mail_only),
    pollingLocationIds: precinct.polling_location_id,
    earlyVoteSiteIds: precinct.early_vote_site_id,
    ballotStyleImageUrl: precinct.ballot_style_image_url,
    _feed: this.feedId
  });
};

Precinct.prototype.mapXml5_0 = function (precinct) {
  this.version = "v5";

  this.model = new this.models.precincts({
    _id: types.ObjectId(),
    elementId: precinct.$.id,     //required
    name: precinct.name,
    number: precinct.number,
    localityId: precinct.locality_id,
    electoralDistrictIds: precinct.electoral_district_id,
    ward: precinct.ward,
    mailOnly: this.convertYesNo(precinct.mail_only),
    pollingLocationIds: precinct.polling_location_id,
    earlyVoteSiteIds: precinct.early_vote_site_id,
    ballotStyleImageUrl: precinct.ballot_style_image_url,
    registeredVoters: precinct.registered_voters,
    _feed: this.feedId,
    _precinctSplits: precinct._precinctSplits,
    _pollingLocations: precinct._pollingLocations
  });
};

Precinct.prototype.mapCsv = function (precinct) {
  this.model = new this.models.precincts({
    elementId: precinct.id,     //required
    name: precinct.name,
    number: precinct.number,
    localityId: precinct.locality_id,
    electoralDistrictIds: precinct.electoral_district_id,
    ward: precinct.ward,
    mailOnly: this.convertYesNo(precinct.mail_only),
    pollingLocationIds: precinct.polling_location_id,
    earlyVoteSiteIds: precinct.early_vote_site_id,
    ballotStyleImageUrl: precinct.ballot_style_image_url,
    _feed: this.feedId
  });
};


module.exports = Precinct;
