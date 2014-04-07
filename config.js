/**
 * Created by bantonides on 11/21/13.
 */
var config = {};

config.upload = {
  uploadPath: 'upload/'
};

config.web = {
  port: process.env.PORT || 4000,
  favicon: 'public/assets/images/favicon.ico',
  loglevel: 'dev',
  sessionsecret: 'ssshh!!',
  enableSSL: false,
  SSLKey: '/vipdata/certs/*_votinginfoproject_org.key',
  SSLCert: '/vipdata/certs/*_votinginfoproject_org_chained.crt'
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

config.importer = {
  useS3: false,
  s3AccessKeyId: 'FillInAccessKeyHere',
  s3SecretAccessKey: 'FillInSecretAccessKeyHere',
  s3Region: 'us-east-1',
  uploadFolder: 'upload/' //used if useS3 is false
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
    fips: 'statefips',

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


// Add more states if required.
config.checkSingleHouseStates = function(fipsCode) {
  return fipsCode === 39 || fipsCode === 32;
}

module.exports = config;
