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

var saveCounter = 0;

/*
 * functions to move into base class
 */
function onError(err) {
  console.error(err);
};

function onUpdate(err, numAffected) {
  if (err) {
    console.error(err);
  }
  else {
    console.log('Updated ' + numAffected + ' document.')
  }
};

function addRef() {
  saveCounter++;
  console.log('save++ - ' + saveCounter);
};

function decRef() {
  saveCounter--;
  console.log('save-- - ' + saveCounter);

  if (saveCounter == 0) {
    console.log('Creating database relationships...');
    createDBRelationships();
  }
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
  var model = new Ballot(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(ballot);
  model.save(onError, function() { console.log('Stored ballot element to database.'); })
};

function processBallotLineResultElement(ballotLineResult) {
  var model = new BallotLineResult(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(ballotLineResult);
  model.save(onError, function() { console.log('Stored ballot line result element to database.'); })
};

function processBallotResponseElement(ballotResponse) {
  var model = new BallotResponse(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(ballotResponse);
  model.save(onError, function() { console.log('Stored ballot response element to database.'); })
};

function processCandidateElement(candidate) {
  var model = new Candidate(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(candidate);
  model.save(onError, function() { console.log('Stored candidate element to database.'); })
};

function processContestElement(contest) {
  var model = new Contest(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(contest);
  model.save(onError, function() { console.log('Stored contest element to database'); });
};

function processContestResultElement(contestResult) {
  var model = new ContestResult(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(contestResult);
  model.save(onError, function() { console.log('Stored contest result element to database'); });
};

function processCustomBallotElement(customBallot) {
  var model = new CustomBallot(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(customBallot);
  model.save(onError, function() { console.log('Stored custom ballot element to database'); });
};

function processEarlyVoteSiteElement(earlyVoteSite) {
  var model = new EarlyVoteSite(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(earlyVoteSite);
  model.save(onError, function() { console.log('Stored early vote site element to database'); });
};

function processElectionElement(election) {
  var model = new Election(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(election);
  model.save(onError, function() { console.log('Stored election element to database'); });
};

function processElectionAdministrationElement(electionAdmin) {
  var model = new ElectionAdministration(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(electionAdmin);
  model.save(onError, function() { console.log('Stored election administration element to database'); });
};

function processElectionOfficialElement(official) {
  var model = new ElectionOfficial(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(official);
  model.save(onError, function() { console.log('Stored election official element to database'); });
};

function processElectoralDistrictElement(electoralDistrict) {
  var model = new ElectoralDistrict(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(electoralDistrict);
  model.save(onError, function() { console.log('Stored electoral district element to database'); });
};

function processLocalityElement(locality) {
  var model = new Locality(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(locality);
  model.save(onError, function() { console.log('Stored locality to database'); });
};

function processPollingLocationElement(pollingLocation) {
  var model = new PollingLocation(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(pollingLocation);
  model.save(onError, function() { console.log('Stored polling location to database'); });
};

function processPrecinctElement(precinct) {
  var model = new Precinct(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(precinct);
  model.save(onError, function() { console.log('Stored precinct to database'); });
}

function processPrecinctSplitElement(precinctSplit) {
  var model = new PrecinctSplit(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(precinctSplit);
  model.save(onError, function() { console.log('Stored precinct split to database'); });
}

function processReferendumElement(referendum) {
  var model = new Referendum(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(referendum);
  model.save(onError, function() { console.log('Stored referendum to database'); });
}

function processSourceElement(source) {
  var model = new Source(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(source);
  model.save(onError, function() { console.log('Stored source element to database.'); })
};

function processStateElement(state) {
  var model = new State(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(state);
  model.save(onError, function() { console.log('Stored state element to database.'); })
};

function processStreetSegmentElement(streetSegment) {
  var model = new StreetSegment(models, feedDoc._id);
  model.on('saving', addRef);
  model.on('saved', decRef);
  model.mapXml3_0(streetSegment);
  model.save(onError, function() { console.log('Stored street segment element to database.'); })
};

function createDBRelationships() {
  var promise = models.Source.findOne({ _feed: feedDoc._id }).exec();
  var sourceId;

  promise.then(function (source) {
    sourceId = source._id;
    return models.ElectionOfficial.findOne({ _feed: feedDoc._id, elementId: source.feedContactId }).select('_id').exec();
  }).then(function (eoId) {
      models.Source.update({ _id: sourceId }, { _feedContact: eoId }, onUpdate);
    }, onError);
};

exports.processXml = saveBasicFeedInfo;