/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  Candidate = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Candidate);
  };
util.inherits(Candidate, basemapper);

Candidate.prototype.mapXml3_0 = function (candidate) {
  this.model = new this.models.Candidate({
    elementId: candidate.$.id,     //required
    name: candidate.name,
    party: candidate.party,
    candidateUrl: candidate.candidate_url,
    biography: candidate.biography,
    phone: candidate.phone,
    photoUrl: candidate.photo_url,
    filedMailingAddress: this.mapSimpleAddress(candidate.filed_mailing_address),
    email: candidate.email,
    sortOrder: candidate.sort_order,
    _feed: this.feedId
  });
};

Candidate.prototype.mapXml5_0 = function (candidate) {
  this.version = "v5";

  this.model = new this.models.Candidate({
    elementId: candidate.$.id,     //required
    name: candidate.name,
    partyId: candidate.party_id,
    candidateUrl: candidate.candidate_url,
    biography: candidate.biography,
    phone: candidate.phone,
    photoUrl: candidate.photo_url,
    filedMailingAddress: this.mapSimpleAddress(candidate.filed_mailing_address),
    email: candidate.email,
    incumbent: candidate.incumbent,
    lastName: candidate.lastName,
    candidateStatus: candidate.candidate_status,
    sortOrder: candidate.sort_order,
    ballotId: candidate.ballot_id,
    _feed: this.feedId
  });
};

Candidate.prototype.mapCsv = function (candidate) {
  this.model = new this.models.Candidate({
    elementId: candidate.id,     //required
    name: candidate.name,
    party: candidate.party,
    candidateUrl: candidate.candidate_url,
    biography: candidate.biography,
    phone: candidate.phone,
    photoUrl: candidate.photo_url,
    filedMailingAddress: {
      locationName: candidate.filed_mailing_address_location_name,
      line1: candidate.filed_mailing_address_line1,
      line2: candidate.filed_mailing_address_line2,
      line3: candidate.filed_mailing_address_line3,
      city: candidate.filed_mailing_address_city,
      state: candidate.filed_mailing_address_state,
      zip: candidate.filed_mailing_address_zip
    },
    email: candidate.email,
    sortOrder: candidate.sort_order,
    _feed: this.feedId
  });
};


module.exports = Candidate;
