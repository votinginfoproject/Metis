/**
 * Created by bantonides on 3/5/14.
 */
module.exports = {
  mapperLookup: {
    ballot: require('./mappers/Ballot'),
    ballot_candidate: require('./mappers/VaveBallotCandidate'),
    ballot_line_result: require('./mappers/BallotLineResult'),
    ballot_response: require('./mappers/BallotResponse'),
    candidate: require('./mappers/Candidate'),
    contest: require('./mappers/Contest'),
    contest_result: require('./mappers/ContestResult'),
    custom_ballot: require('./mappers/CustomBallot'),
//  custom_ballot_response:
    early_vote_site: require('./mappers/EarlyVoteSite'),
    election: require('./mappers/Election'),
    election_administration: require('./mappers/ElectionAdministration'),
    election_official: require('./mappers/ElectionOfficial'),
    electoral_district: require('./mappers/ElectoralDistrict'),
    locality: require('./mappers/Locality'),
//    locality_early_vote_site:
    polling_location: require('./mappers/PollingLocation'),
    precinct: require('./mappers/Precinct'),
//    precinct_early_vote_site:
//    precinct_electoral_district:
//    precinct_polling_location:
    precinct_split: require('./mappers/PrecinctSplit'),
//    precinct_split_electoral_district:
//    precinct_split_polling_location:
    referendum: require('./mappers/Referendum'),
//    referendum_ballot_response:
    source: require('./mappers/Source'),
    state: require('./mappers/State'),
//    state_early_vote_site:
    street_segment: require('./mappers/StreetSegment')
  }
};