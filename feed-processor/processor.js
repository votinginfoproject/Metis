/**
 * Created by bantonides on 12/20/13.
 */
var config = require('../config');
var mongoose = require('mongoose');
var schemas = require('../dao/schemas');
var Source = require('./mappers/Source');

var db;
var feedDoc = {};

function connectMongo(connectionString, next) {
  mongoose.connect(connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
    next();
  });
};

function initiateFeedParsing(path) {
  schemas.initSchemas(config, mongoose);

  connectMongo(config.mongoose.connectionString, function () {
      saveBasicFeedInfo(path);
  });
};

function saveBasicFeedInfo(filePath) {
  var path = require('path');

  var feed = new schemas.models.Feed({
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

function onError(err) {
  console.error(err);
};

function processSourceElement(source) {
  console.log(source);

  var sourceModel = new Source(schemas.models, feedDoc._id);
  sourceModel.mapXml3_0(source);
  sourceModel.save(onError, function() { console.log('Stored source element to database.'); })
};

function yesNoConverter(yesNoValue) {
  if (yesNoValue === undefined) {
    return undefined;
  }

  return "YES".toUpperCase() == yesNoValue.toUpperCase();
};

function processElectionElement(election) {
  console.log(election);

  var electionModel = new schemas.models.Election({
    elementId: election.$.id,
    date: election.date,
    electionType: election.election_type,
    stateId: election.state_id,
    statewide: yesNoConverter(election.statewide),
    registrationInfo: election.registration_info,
    absenteeBallotInfo: election.absentee_ballot_info,
    resultsUrl: election.results_url,
    pollingHours: election.polling_hours,
    electionDayRegistration: yesNoConverter(election.election_day_registration),
    registrationDeadline: election.registration_deadline,
    absenteeRequestDeadline: election.absentee_requet_deadline,
    _feed: feedDoc._id
  });
  electionModel.save(function (err, data) {
    if (err) {
      console.error(err);
    }
    else {
      console.log('Stored election element to database.');
    }
  });
};

function processElectionOfficialElement(official) {
  console.log(official);

  var officialModel = new schemas.models.ElectionOfficial({
    elementId: official.$.id,
    name: official.name,
    title: official.title,
    phone: official.phone,
    fax: official.fax,
    email: official.email,
    _feed: feedDoc._id
  });
  officialModel.save(function (err, data) {
    if (err) {
      console.error(err);
    }
    else {
      console.log('Stored election official element to database.');
    }
  });
};

function processContestElement(contest) {
  console.log(contest);

  var contestModel = new schemas.models.Contest({
    elementId: contest.$.id,     //required
    electionId:  contest.election_id,
    electoralDistrictId:  contest.electoral_district_id,
    type: contest.type,
    partisan: yesNoConverter(contest.partisan),
    primaryParty: contest.primary_party,
    electorateSpecifications: contest.electorate_specifications,
    special: yesNoConverter(contest.special),
    office: contest.office,
    filingClosedDate: contest.filing_closed_date,
    numberElected:  contest.number_elected,
    numberVotingFor: contest.number_voting_for,
    ballotId: contest.ballot_id,
    ballotPlacement: contest.ballot_placement,
    _feed: feedDoc._id
  });
  contestModel.save(function (err, data) {
    if (err) {
      console.error(err);
    }
    else {
      console.log('Stored contest element to database.');
    }
  });
};

function readXMLFile(filePath) {
  var xstream = require('xml-stream');
  var fs = require('fs');
  var path = require('path');

  var stream = fs.createReadStream(path.join(__dirname, filePath));
  var xml = new xstream(stream);

  xml.on('endElement: source', processSourceElement);
  xml.on('endElement: election', processElectionElement);
  xml.on('endElement: election_official', processElectionOfficialElement);
  xml.on('endElement: contest', processContestElement);
};

if (process.argv.length > 2 && process.argv[2] != null) {
  initiateFeedParsing(process.argv[2]);
}
else {
  console.error("ERROR: insufficient arguments provided \n");

  console.log("Usage: node  <javascript_file_name>  <relative_xml_file_path>");
  console.log("");
  process.exit();
}
