/**
 * Created by bantonides on 11/21/13.
 */
var config = {};

config.upload = {
  uploadPath: 'upload/'
};

// Log path is relative (should not start with a slash '/', but requires the end slash '/')
// Log folder will be created if it doesn't exist.
// Log level defaults to 'debug' in development, and 'info' in production
config.log = {
  logpath: 'logs/',
  logname: 'vip.log',
  lognameErrors: 'vip-errors.log',
  lognameExceptions: 'vip-exceptions.log',
  lognameSeparateProfile: 'separateProfile.log',
  logProfileEnabled: false,
  logProfileMongoDB: 'metis',
  logProfileMongoDBCollection: '_profilelogs',
  loglevel: 'info',
  maxsizeMB: 2, // 2MB max log size
  maxFiles:  3   // 3 log files in rotation
  // ,papertrail: {
  //   host: '<<INSERT YOUR PAPERTRAIL HOST URL, ie logs.papertrailapp.com',
  //   port: <<INSERT YOUR PAPERTRAIL PORT #>>,
  //   appname: 'metis' //how you want the source identified in papertrail
  // }
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
    ballotlineresult: 'ballotlineresults',
    ballotresponse: 'ballotresponses',
    candidate: 'candidates',
    contest: 'contests',
    contestresult: 'contestresults',
    customballot: 'customballots',
    earlyvotesite: 'earlyvotesites',
    election: 'elections',
    electionadministration: 'electionadmins',
    electionofficial: 'electionofficials',
    electoraldistrict: 'electoraldistricts',
    feed: 'feeds',
    locality: 'localitys',
    pollinglocation: 'pollinglocations',
    precinct: 'precincts',
    precinctsplit: 'precinctsplits',
    referendum: 'referendums',
    source: 'sources',
    state: 'states',
    streetsegment: 'streetsegments',

    ballotstyle: 'ballotstyles',
    party: 'parties',
    multigeometry: 'multigeometries',
    polygontype: 'polygontypes',

    balloterror: 'balloterrors',
    ballotlineresulterror: 'ballotlineresulterrors',
    ballotresponseerror: 'ballotresponseerrors',
    candidateerror: 'candidateerrors',
    contesterror: 'contesterrors',
    contestresulterror: 'contestresulterrors',
    customballoterror: 'customballoterrors',
    earlyvotesiteerror: 'earlyvotesiteerrors',
    electionerror: 'electionerrors',
    electionadministrationerror: 'electionadminerrors',
    electionofficialerror: 'electionofficialerrors',
    electoraldistricterror: 'electoraldistricterrors',
    feederror: 'feederrors',
    localityerror: 'localityerrors',
    pollinglocationerror: 'pollinglocationerrors',
    precincterror: 'precincterrors',
    precinctspliterror: 'precinctspliterrors',
    referendumerror: 'referendumerrors',
    sourceerror: 'sourceerrors',
    stateerror: 'stateerrors',
    streetsegmenterror: 'streetsegmenterrors',

    ballotstyleerror: 'ballotstyleerrors',
    partyerror: 'partyerrors',
    multigeometryerror: 'multigeometryerrors',
    polygontypeerror: 'polygontypeerrors',

    overview: 'overviews',
    county: 'counties',
    fips: 'statefips',

    ballotcandidate: 'ballotcandidates',
    customballotballotresponse: 'customballotballotresponses',
    localityearlyvotesite: 'localityearlyvotesites',
    precinctearlyvotesite: 'precinctearlyvotesites',
    precinctelectoraldistrict: 'precinctelectoraldistricts',
    precinctpollinglocation: 'precinctpollinglocations',
    precinctsplitelectoraldistrict: 'precinctsplitelectoraldistricts',
    precinctsplitpollinglocation: 'precinctsplitpollinglocations',
    referendumballotresponse: 'referendumballotresponses',
    stateearlyvotesite: 'stateearlyvotesites',

    precinctsplitelectoraldistrict: 'precinctsplitelectoraldistricts',
    precinctsplitballotstyle: 'precinctsplitballotstyles',

    uniqueid: 'uniqueids'
  },
  dbname: 'metis',
  connectionString: 'mongodb://localhost/metis',
  maxWriteQueueLength: 20000
}


// Add more states if required.
config.checkSingleHouseStates = function(fipsCode) {
  return fipsCode === 39 || fipsCode === 32;
}

module.exports = config;
