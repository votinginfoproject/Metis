/**
 * Created by bantonides on 3/5/14.
 */
var baseConfig = require('../config');

baseConfig.mapperLookup = {
  ballot: require('./mappers/Ballot'),
  ballot_candidate: require('./mappers/BallotCandidate'),
  ballot_line_result: require('./mappers/BallotLineResult'),
  ballot_response: require('./mappers/BallotResponse'),
  candidate: require('./mappers/Candidate'),
  contest: require('./mappers/Contest'),
  contest_result: require('./mappers/ContestResult'),
  custom_ballot: require('./mappers/CustomBallot'),
  custom_ballot_ballot_response: require('./mappers/CustomBallotBallotResponse'),
  early_vote_site: require('./mappers/EarlyVoteSite'),
  election: require('./mappers/Election'),
  election_administration: require('./mappers/ElectionAdministration'),
  election_official: require('./mappers/ElectionOfficial'),
  electoral_district: require('./mappers/ElectoralDistrict'),
  locality: require('./mappers/Locality'),
  locality_early_vote_site: require('./mappers/LocalityEarlyVoteSite'),
  polling_location: require('./mappers/PollingLocation'),
  precinct: require('./mappers/Precinct'),
  precinct_early_vote_site: require('./mappers/PrecinctEarlyVoteSite'),
  precinct_electoral_district: require('./mappers/PrecinctElectoralDistrict'),
  precinct_polling_location: require('./mappers/PrecinctPollingLocation'),
  precinct_split: require('./mappers/PrecinctSplit'),
  precinct_split_electoral_district: require('./mappers/PrecinctSplitElectoralDistrict'),
  precinct_split_polling_location: require('./mappers/PrecinctSplitPollingLocation'),
  referendum: require('./mappers/Referendum'),
  referendum_ballot_response: require('./mappers/ReferendumBallotResponse'),
  source: require('./mappers/Source'),
  state: require('./mappers/State'),
  state_early_vote_site: require('./mappers/StateEarlyVoteSite'),
  street_segment: require('./mappers/StreetSegment')
};

module.exports = baseConfig;