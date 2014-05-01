/**
 * Created by bantonides on 12/26/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  Election = function (models, feedId) {
    basemapper.call(this, models, feedId, 'Election');
  };
util.inherits(Election, basemapper);

Election.prototype.mapXml3_0 = function (election) {
  this.model = new this.models.Election({
    elementId: election.$.id,
    date: election.date,
    electionType: election.election_type,
    stateId: election.state_id,
    statewide: this.convertYesNo(election.statewide),
    registrationInfo: election.registration_info,
    absenteeBallotInfo: election.absentee_ballot_info,
    resultsUrl: election.results_url,
    pollingHours: election.polling_hours,
    electionDayRegistration: this.convertYesNo(election.election_day_registration),
    registrationDeadline: election.registration_deadline,
    absenteeRequestDeadline: election.absentee_request_deadline,
    _feed: this.feedId
  });
};

Election.prototype.mapXml5_0 = function (election) {
  this.version = "v5";

  this.model = new this.models.Election({
    elementId: election.$.id,
    date: election.date,
    electionType: election.election_type,
    stateId: election.state_id,
    statewide: this.convertYesNo(election.statewide),
    registrationInfo: election.registration_info,
    absenteeBallotInfo: election.absentee_ballot_info,
    resultsUrl: election.results_url,
    pollingHours: election.polling_hours,
    electionDayRegistration: this.convertYesNo(election.election_day_registration),
    registrationDeadline: election.registration_deadline,
    absenteeRequestDeadline: election.absentee_request_deadline,
    name: election.name,
    divisionId: election.division_id,
    uocavaMailDeadline: election.uocava_mail_deadline,
    _feed: this.feedId
  });
};

Election.prototype.mapCsv = function (election) {
  this.model = new this.models.Election({
    elementId: election.id,
    date: election.date,
    electionType: election.election_type,
    stateId: election.state_id,
    statewide: this.convertYesNo(election.statewide),
    registrationInfo: election.registration_info,
    absenteeBallotInfo: election.absentee_ballot_info,
    resultsUrl: election.results_url,
    pollingHours: election.polling_hours,
    electionDayRegistration: this.convertYesNo(election.election_day_registration),
    registrationDeadline: election.registration_deadline,
    absenteeRequestDeadline: election.absentee_request_deadline,
    _feed: this.feedId
  });

};


module.exports = Election;
