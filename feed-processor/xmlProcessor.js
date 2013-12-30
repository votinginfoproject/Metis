/**
 * Created by bantonides on 12/26/13.
 */
var feedDoc;
var schemaVersion;
var models;

var Ballot = require('./mappers/Ballot');
var BallotLineResult = require('./mappers/BallotLineResult');
var BallotResponse = require('./mappers/BallotResponse');
var Candidate = require('./mappers/Candidate');
var Contest = require('./mappers/Contest');
var ContestResult = require('./mappers/ContestResult');
var CustomBallot = require('./mappers/CustomBallot');
var EarlyVoteSite = require('./mappers/EarlyVoteSite');
var Election = require('./mappers/Election');
var ElectionAdministration = require('./mappers/ElectionAdministration');
var ElectionOfficial = require('./mappers/ElectionOfficial');
var ElectoralDistrict = require('./mappers/ElectoralDistrict');
var Locality = require('./mappers/Locality');
var PollingLocation = require('./mappers/PollingLocation');
var Precinct = require('./mappers/Precinct');
var PrecinctSplit = require('./mappers/PrecinctSplit');
var Referendum = require('./mappers/Referendum');
var Source = require('./mappers/Source');
var State = require('./mappers/State');
var StreetSegment = require('./mappers/StreetSegment');


/*
 * functions to move into base class
 */
function onError(err) {
  console.error(err);
};

function readXMLFile(filePath) {
  var xstream = require('xml-stream');
  var fs = require('fs');
  var path = require('path');

  var stream = fs.createReadStream(path.join(__dirname, filePath));
  var xml = new xstream(stream);

  xml.collect('early_vote_site_id');
  xml.collect('candidate_id');
  xml.collect('electoral_district_id');
  xml.collect('polling_location_id');
  xml.collect('ballot_response_id');

  xml.on('startElement: vip_object', processFeedAttributes)
  xml.on('endElement: ballot', processBallotElement);
  xml.on('endElement: ballot_line_result', processBallotLineResultElement);
  xml.on('endElement: ballot_response', processBallotResponseElement);
  xml.on('endElement: candidate', processCandidateElement);
  xml.on('endElement: contest', processContestElement);
  xml.on('endElement: contest_result', processContestResultElement);
  xml.on('endElement: custom_ballot', processCustomBallotElement);
  xml.on('endElement: early_vote_site', processEarlyVoteSiteElement);
  xml.on('endElement: election', processElectionElement);
  xml.on('endElement: election_administration', processElectionAdministrationElement);
  xml.on('endElement: election_official', processElectionOfficialElement);
  xml.on('endElement: electoral_district', processElectoralDistrictElement);
  xml.on('endElement: locality', processLocalityElement);
  xml.on('endElement: polling_location', processPollingLocationElement);
  xml.on('endElement: precinct', processPrecinctElement);
  xml.on('endElement: precinct_split', processPrecinctSplitElement);
  xml.on('endElement: referendum', processReferendumElement);
  xml.on('endElement: source', processSourceElement);
  xml.on('endElement: state', processStateElement);
  xml.on('endElement: street_segment', processStreetSegmentElement);
};

function saveBasicFeedInfo(schemas, filePath) {
  var path = require('path');
  models = schemas.models;

  var feed = new models.Feed({
    loadedOn: new Date(),
    feedPath: filePath,
    feedStatus: 'Processing',
    name: path.basename(filePath, path.extname(filePath))
  });

  feed.save(function (err, feed) {
    if (err) {
      console.error(err);
    }
    else {
      feedDoc = feed;
      readXMLFile(filePath);
    }
  });
};

function processFeedAttributes(vipObject) {
  schemaVersion = vipObject.$.schemaVersion;
};

function processBallotElement(ballot) {
//  console.log(ballot);

  var ballotModel = new Ballot(models, feedDoc._id);
  ballotModel.mapXml3_0(ballot);
  ballotModel.save(onError, function() { console.log('Stored ballot element to database.'); })
};

function processBallotLineResultElement(ballotLineResult) {
//  console.log(ballotLineResult);

  var ballotLineResultModel = new BallotLineResult(models, feedDoc._id);
  ballotLineResultModel.mapXml3_0(ballotLineResult);
  ballotLineResultModel.save(onError, function() { console.log('Stored ballot line result element to database.'); })
};

function processBallotResponseElement(ballotResponse) {
//  console.log(ballotResponse);

  var ballotResponseModel = new BallotResponse(models, feedDoc._id);
  ballotResponseModel.mapXml3_0(ballotResponse);
  ballotResponseModel.save(onError, function() { console.log('Stored ballot response element to database.'); })
};

function processCandidateElement(candidate) {
//  console.log(candidate);

  var candidateModel = new Candidate(models, feedDoc._id);
  candidateModel.mapXml3_0(candidate);
  candidateModel.save(onError, function() { console.log('Stored candidate element to database.'); })
};

function processContestElement(contest) {
//  console.log(contest);

  var contestModel = new Contest(models, feedDoc._id);
  contestModel.mapXml3_0(contest);
  contestModel.save(onError, function() { console.log('Stored contest element to database'); });
};

function processContestResultElement(contestResult) {
//  console.log(contestResult);

  var contestResultModel = new ContestResult(models, feedDoc._id);
  contestResultModel.mapXml3_0(contestResult);
  contestResultModel.save(onError, function() { console.log('Stored contest result element to database'); });
};

function processCustomBallotElement(customBallot) {
//  console.log(customBallot);

  var customBallotModel = new CustomBallot(models, feedDoc._id);
  customBallotModel.mapXml3_0(customBallot);
  customBallotModel.save(onError, function() { console.log('Stored custom ballot element to database'); });
};

function processEarlyVoteSiteElement(earlyVoteSite) {
//  console.log(earlyVoteSite);

  var earlyVoteSiteModel = new EarlyVoteSite(models, feedDoc._id);
  earlyVoteSiteModel.mapXml3_0(earlyVoteSite);
  earlyVoteSiteModel.save(onError, function() { console.log('Stored early vote site element to database'); });
};

function processElectionElement(election) {
//  console.log(election);

  var electionModel = new Election(models, feedDoc._id);
  electionModel.mapXml3_0(election);
  electionModel.save(onError, function() { console.log('Stored election element to database'); });
};

function processElectionAdministrationElement(electionAdmin) {
//  console.log(electionAdmin);

  var electionAdminModel = new ElectionAdministration(models, feedDoc._id);
  electionAdminModel.mapXml3_0(electionAdmin);
  electionAdminModel.save(onError, function() { console.log('Stored election administration element to database'); });
};

function processElectionOfficialElement(official) {
//  console.log(official);

  var electionOfficialModel = new ElectionOfficial(models, feedDoc._id);
  electionOfficialModel.mapXml3_0(official);
  electionOfficialModel.save(onError, function() { console.log('Stored election official element to database'); });
};

function processElectoralDistrictElement(electoralDistrict) {
//  console.log(electoralDistrict);

  var electoralDistrictModel = new ElectoralDistrict(models, feedDoc._id);
  electoralDistrictModel.mapXml3_0(electoralDistrict);
  electoralDistrictModel.save(onError, function() { console.log('Stored electoral district element to database'); });
};

function processLocalityElement(locality) {
//  console.log(locality);

  var localityModel = new Locality(models, feedDoc._id);
  localityModel.mapXml3_0(locality);
  localityModel.save(onError, function() { console.log('Stored locality to database'); });
};

function processPollingLocationElement(pollingLocation) {
//  console.log(pollingLocation);

  var pollingLocationModel = new PollingLocation(models, feedDoc._id);
  pollingLocationModel.mapXml3_0(pollingLocation);
  pollingLocationModel.save(onError, function() { console.log('Stored polling location to database'); });
};

function processPrecinctElement(precinct) {
//  console.log(precinct);

  var precinctModel = new Precinct(models, feedDoc._id);
  precinctModel.mapXml3_0(precinct);
  precinctModel.save(onError, function() { console.log('Stored precinct to database'); });
}

function processPrecinctSplitElement(precinctSplit) {
//  console.log(precinctSplit);

  var precinctSplitModel = new PrecinctSplit(models, feedDoc._id);
  precinctSplitModel.mapXml3_0(precinctSplit);
  precinctSplitModel.save(onError, function() { console.log('Stored precinct split to database'); });
}

function processReferendumElement(referendum) {
//  console.log(referendum);

  var referendumModel = new Referendum(models, feedDoc._id);
  referendumModel.mapXml3_0(referendum);
  referendumModel.save(onError, function() { console.log('Stored referendum to database'); });
}

function processSourceElement(source) {
//  console.log(source);

  var sourceModel = new Source(models, feedDoc._id);
  sourceModel.mapXml3_0(source);
  sourceModel.save(onError, function() { console.log('Stored source element to database.'); })
};

function processStateElement(state) {
//  console.log(state);

  var stateModel = new State(models, feedDoc._id);
  stateModel.mapXml3_0(state);
  stateModel.save(onError, function() { console.log('Stored state element to database.'); })
};

function processStreetSegmentElement(streetSegment) {
//  console.log(streetSegment);

  var streetSegmentModel = new StreetSegment(models, feedDoc._id);
  streetSegmentModel.mapXml3_0(streetSegment);
  streetSegmentModel.save(onError, function() { console.log('Stored street segment element to database.'); })
};

exports.processXml = saveBasicFeedInfo;