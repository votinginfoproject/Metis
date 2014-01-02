/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  ElectionAdministration = function (models, feedId) {
    basemapper.call(this, models, feedId);
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

};

ElectionAdministration.prototype.mapCsv = function (electionAdmin) {

};


module.exports = ElectionAdministration;
