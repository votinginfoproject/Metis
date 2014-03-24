/**
 * Created by bantonides on 11/21/13.
 */
var config = {};

config.upload = {
  uploadPath: "/upload" // must be a path relative to the root of the app
};

config.web = {
  port: process.env.PORT || 4000,
  favicon: 'public/assets/images/favicon.ico',
  loglevel: 'dev',
  sessionsecret: 'ssshh!!'
};

config.crowd = {
  server: 'http://192.168.10.160:8095/crowd/',
  application: 'votinginfoapp',
  apppass: 'thisissecret',
  retrieveGroups: true,
  uselocalauth: true
};

config.ruleEngine = {
  isPersistent: true  //true if you want to save rule violations to mongo dB
}

config.exporter = {
  tempLocation: './temp/',
  dirLocation: './feeds/'
}

/**
 * vipModel contains data regarding db schema model values
 * @type {{feed: string, election: string, source: string}}
 */
config.mongoose = {
  model: {
    ballot: 'ballots',
    ballotLineResult: 'ballotLineResults',
    ballotResponse: 'ballotResponses',
    candidate: 'candidates',
    contest: 'contests',
    contestResult: 'contestResults',
    customBallot: 'customBallots',
    earlyVoteSite: 'earlyVoteSites',
    election: 'elections',
    electionAdministration: 'electionAdministrations',
    electionOfficial: 'electionOfficials',
    electoralDistrict: 'electoralDistricts',
    feed: 'feeds',
    locality: 'localitys',
    pollingLocation: 'pollingLocations',
    precinct: 'precincts',
    precinctSplit: 'precinctSplits',
    referendum: 'referendums',
    source: 'sources',
    state: 'states',
    streetSegment: 'streetSegments',

    ballotError: 'ballotErrors',
    ballotLineResultError: 'ballotLineResultErrors',
    ballotResponseError: 'ballotResponseErrors',
    candidateError: 'candidateErrors',
    contestError: 'contestErrors',
    contestResultError: 'contestResultErrors',
    customBallotError: 'customBallotErrors',
    earlyVoteSiteError: 'earlyVoteSiteErrors',
    electionError: 'electionErrors',
    electionAdministrationError: 'electionAdministrationErrors',
    electionOfficialError: 'electionOfficialErrors',
    electoralDistrictError: 'electoralDistrictErrors',
    feedError: 'feedErrors',
    localityError: 'localityErrors',
    pollingLocationError: 'pollingLocationErrors',
    precinctError: 'precinctErrors',
    precinctSplitError: 'precinctSplitErrors',
    referendumError: 'referendumErrors',
    sourceError: 'sourceErrors',
    stateError: 'stateErrors',
    streetSegmentError: 'streetSegmentErrors',

    overview: 'overviews',
    county: 'counties',

    ballotCandidate: 'ballotCandidates',
    customBallotBallotResponse: 'customBallotBallotResponses',
    localityEarlyVoteSite: 'localityEarlyVoteSites',
    precinctEarlyVoteSite: 'precinctEarlyVoteSites',
    precinctElectoralDistrict: 'precinctElectoralDistricts',
    precinctPollingLocation: 'precinctPollingLocations',
    precinctSplitElectoralDistrict: 'precinctSplitElectoralDistricts',
    precinctSplitPollingLocation: 'precinctSplitPollingLocations',
    referendumBallotResponse: 'referendumBallotResponses',
    stateEarlyVoteSite: 'stateEarlyVoteSites'

  },
  connectionString: 'mongodb://localhost/metis',
  maxWriteQueueLength: 20000
}

module.exports = config;
