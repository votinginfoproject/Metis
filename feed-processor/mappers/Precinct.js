/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Precinct = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Precinct);
  };
util.inherits(Precinct, basemapper);

Precinct.prototype.mapXml3_0 = function (precinct) {
  this.model = new this.models.Precinct({
    elementId: this.convertId(precinct.$.id),     //required
    name: precinct.name,
    number: precinct.number,
    localityId: precinct.locality_id,
    electoralDistrictIds: this.convertId(precinct.electoral_district_id),
    ward: precinct.ward,
    mailOnly: this.convertYesNo(precinct.mail_only),
    pollingLocationIds: this.convertId(precinct.polling_location_id),
    earlyVoteSiteIds: this.convertId(precinct.early_vote_site_id),
    ballotStyleImageUrl: precinct.ballot_style_image_url,
    _feed: this.feedId
  });
};

Precinct.prototype.mapXml5_0 = function (precinct) {
  this.mapXml3_0(precinct);
};

Precinct.prototype.mapCsv = function (precinct) {
  this.model = new this.models.Precinct({
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
