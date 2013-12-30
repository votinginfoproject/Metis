/**
 * Created by bantonides on 12/26/13.
 */
var feedDoc;
var schemaVersion;
var models;

var Source = require('./mappers/Source');
var Election = require('./mappers/Election');
var ElectionOfficial = require('./mappers/ElectionOfficial');
var Contest = require('./mappers/Contest');
var PollingLocation = require('./mappers/PollingLocation');
var Locality = require('./mappers/Locality');

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

  xml.on('startElement: vip_object', processFeedAttributes)
  xml.on('endElement: source', processSourceElement);
  xml.on('endElement: election', processElectionElement);
  xml.on('endElement: election_official', processElectionOfficialElement);
  xml.on('endElement: contest', processContestElement);
  xml.on('endElement: polling_location', processPollingLocation);
  xml.on('endElement: locality', processLocality);
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

function processSourceElement(source) {
  console.log(source);

  var sourceModel = new Source(models, feedDoc._id);
  sourceModel.mapXml3_0(source);
  sourceModel.save(onError, function() { console.log('Stored source element to database.'); })
};

function processElectionElement(election) {
  console.log(election);

  var electionModel = new Election(models, feedDoc._id);
  electionModel.mapXml3_0(election);
  electionModel.save(onError, function() { console.log('Stored election element to database'); });
};

function processElectionOfficialElement(official) {
  console.log(official);

  var electionOfficialModel = new ElectionOfficial(models, feedDoc._id);
  electionOfficialModel.mapXml3_0(official);
  electionOfficialModel.save(onError, function() { console.log('Stored election official element to database'); });
};

function processContestElement(contest) {
  console.log(contest);

  var contestModel = new Contest(models, feedDoc._id);
  contestModel.mapXml3_0(contest);
  contestModel.save(onError, function() { console.log('Stored contest element to database'); });
};

function processPollingLocation(pollingLocation) {
  console.log(pollingLocation);

  var pollingLocationModel = new PollingLocation(models, feedDoc._id);
  pollingLocationModel.mapXml3_0(pollingLocation);
  pollingLocationModel.save(onError, function() { console.log('Stored polling location to database'); });
};

function processLocality(locality) {
  console.log(locality);

  var localityModel = new Locality(models, feedDoc._id);
  localityModel.mapXml3_0(locality);
  localityModel.save(onError, function() { console.log('Stored locality to database'); });
};

exports.processXml = saveBasicFeedInfo;