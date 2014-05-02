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
    ballotLineResult: 'ballot_line_results',
    ballotResponse: 'ballot_responses',
    candidate: 'candidates',
    contest: 'contests',
    contestResult: 'contest_results',
    customBallot: 'custom_ballots',
    earlyVoteSite: 'early_vote_sites',
    election: 'elections',
    electionAdministration: 'election_admins',
    electionOfficial: 'election_officials',
    electoralDistrict: 'electoral_districts',
    feed: 'feeds',
    locality: 'localitys',
    pollingLocation: 'polling_locations',
    precinct: 'precincts',
    precinctSplit: 'precinct_splits',
    referendum: 'referendums',
    source: 'sources',
    state: 'states',
    streetSegment: 'street_segments',

    ballotStyle: 'ballot_styles',
    party: 'parties',
    multiGeometry: 'multi_geometries',
    polygonType: 'polygon_types',

    ballotError: 'ballot_errors',
    ballotLineResultError: 'ballot_line_result_errors',
    ballotResponseError: 'ballot_response_errors',
    candidateError: 'candidate_errors',
    contestError: 'contest_errors',
    contestResultError: 'contest_result_errors',
    customBallotError: 'custom_ballot_errors',
    earlyVoteSiteError: 'early_vote_site_errors',
    electionError: 'election_errors',
    electionAdministrationError: 'election_admin_errors',
    electionOfficialError: 'election_official_errors',
    electoralDistrictError: 'electoral_district_errors',
    feedError: 'feed_errors',
    localityError: 'locality_errors',
    pollingLocationError: 'polling_location_errors',
    precinctError: 'precinct_errors',
    precinctSplitError: 'precinct_split_errors',
    referendumError: 'referendum_errors',
    sourceError: 'source_errors',
    stateError: 'state_errors',
    streetSegmentError: 'street_segment_errors',

    ballotStyleError: 'ballot_style_errors',
    partyError: 'party_errors',
    multiGeometryError: 'multi_geometry_errors',
    polygonTypeError: 'polygon_type_errors',

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
    stateEarlyVoteSite: 'stateEarlyVoteSites',

    precinctSplitElectoralDistrict: 'precinctSplitElectoralDistricts',
    precinctSplitBallotStyle: 'precinctSplitBallotStyles',

    uniqueId: 'uniqueIds'
  },
  connectionString: 'mongodb://localhost/metis',
  maxWriteQueueLength: 20000
}


// Add more states if required.
config.checkSingleHouseStates = function(fipsCode) {
  return fipsCode === 39 || fipsCode === 32;
}

module.exports = config;
