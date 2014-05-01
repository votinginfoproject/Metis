/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  ElectionAdministration = function (models, feedId) {
    basemapper.call(this, models, feedId, 'ElectionAdmin');
    this.modelType = 'ElectionAdmin';
  };
util.inherits(ElectionAdministration, basemapper);

ElectionAdministration.prototype.mapXml3_0 = function (electionAdmin) {
  this.model = new this.models.ElectionAdmin({
    elementId: electionAdmin.$.id,     //required
    name: electionAdmin.name,
    eoId: electionAdmin.eo_id,
    ovcId: electionAdmin.ovc_id,
    physicalAddress: this.mapSimpleAddress(electionAdmin.physical_address),
    mailingAddress: this.mapSimpleAddress(electionAdmin.mailing_address),
    electionsUrl: electionAdmin.elections_url,
    registrationUrl: electionAdmin.registration_url,
    amIRegisteredUrl: electionAdmin.am_i_registered_url,
    absenteeUrl: electionAdmin.absentee_url,
    whereDoIVoteUrl: electionAdmin.where_do_i_vote_url,
    whatIsOnMyBallotUrl: electionAdmin.what_is_on_my_ballot_url,
    rulesUrl: electionAdmin.rules_url,
    voterServices: electionAdmin.voter_services,
    hours: electionAdmin.hours,
    _feed: this.feedId
  });
};

ElectionAdministration.prototype.mapXml5_0 = function (electionAdmin) {
  this.version = "v5";

  this.model = new this.models.ElectionAdmin({
    elementId: electionAdmin.$.id,     //required
    name: electionAdmin.name,
    eoId: electionAdmin.eo_id,
    ovcId: electionAdmin.ovc_id,
    physicalAddress: this.mapSimpleAddress(electionAdmin.physical_address),
    mailingAddress: this.mapSimpleAddress(electionAdmin.mailing_address),
    electionsUrl: electionAdmin.elections_url,
    registrationUrl: electionAdmin.registration_url,
    amIRegisteredUrl: electionAdmin.am_i_registered_url,
    absenteeUrl: electionAdmin.absentee_url,
    whereDoIVoteUrl: electionAdmin.where_do_i_vote_url,
    whatIsOnMyBallotUrl: electionAdmin.what_is_on_my_ballot_url,
    rulesUrl: electionAdmin.rules_url,
    voterServices: electionAdmin.voter_services,
    hours: electionAdmin.hours,
    phone: electionAdmin.phone,
    email: electionAdmin.email,
    _feed: this.feedId
  });
};

ElectionAdministration.prototype.mapCsv = function (electionAdmin) {
  this.model = new this.models.ElectionAdmin({
    elementId: electionAdmin.id,     //required
    name: electionAdmin.name,
    eoId: electionAdmin.eo_id,
    ovcId: electionAdmin.ovc_id,
    physicalAddress: {
      locationName: electionAdmin.physical_address_location_name,
      line1: electionAdmin.physical_address_line1,
      line2: electionAdmin.physical_address_line2,
      line3: electionAdmin.physical_address_line3,
      city: electionAdmin.physical_address_city,
      state: electionAdmin.physical_address_state,
      zip: electionAdmin.physical_address_zip
    },
    mailingAddress: {
      locationName: electionAdmin.mailing_address_location_name,
      line1: electionAdmin.mailing_address_line1,
      line2: electionAdmin.mailing_address_line2,
      line3: electionAdmin.mailing_address_line3,
      city: electionAdmin.mailing_address_city,
      state: electionAdmin.mailing_address_state,
      zip: electionAdmin.mailing_address_zip
    },
    electionsUrl: electionAdmin.elections_url,
    registrationUrl: electionAdmin.registration_url,
    amIRegisteredUrl: electionAdmin.am_i_registered_url,
    absenteeUrl: electionAdmin.absentee_url,
    whereDoIVoteUrl: electionAdmin.where_do_i_vote_url,
    whatIsOnMyBallotUrl: electionAdmin.what_is_on_my_ballot_url,
    rulesUrl: electionAdmin.rules_url,
    voterServices: electionAdmin.voter_services,
    hours: electionAdmin.hours,
    _feed: this.feedId
  });
};


module.exports = ElectionAdministration;
