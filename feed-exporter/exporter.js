/**
 * Created by rcartier13 on 3/3/14.
 */

var db = require('../dao/db');
var fs = require('fs');

var ballot = require('./mappers/ballot');
var ballotLineResult = require('./mappers/ballotLineResult');
var ballotResponse = require('./mappers/ballotResponse');
var candidate = require('./mappers/candidate');
var contest = require('./mappers/contest');
var contestResult = require('./mappers/contestResult');
var customBallot = require('./mappers/customBallot');
var evs = require('./mappers/earlyVoteSite');
var election = require('./mappers/election');
var electionAdmin = require('./mappers/electionAdmin');
var electionOfficial = require('./mappers/electionOfficial');
var district = require('./mappers/electoralDistrict');
var locality = require('./mappers/locality');
var pollingLocation = require('./mappers/pollingLocation');
var precinct = require('./mappers/precinct');
var precinctSplit = require('./mappers/precinctSplit');
var referendum = require('./mappers/referendum');
var source = require('./mappers/source');
var state = require('./mappers/state');
var streetSegment = require('./mappers/streetSegment');

var config = require('../config');
var mongoose = require('mongoose');
var schemas = require('../dao/schemas');

//schemas.initSchemas(mongoose);
//mongoose.connect(config.mongoose.connectionString);

var once = false;
var sent = 0;
var written = 0;
var finished = false;

var functionCalls = [];

// test_feed:
// NC: 531dcf317ccecb5a23000004
//createXml(schemas.types.ObjectId('531dcf317ccecb5a23000004'));

function createXml(feedId, feedName) {

  functionCalls.push(ballot.ballotExport);
  functionCalls.push(ballotLineResult.ballotLineResultExport);
  functionCalls.push(ballotResponse.ballotResponseExport);
  functionCalls.push(candidate.candidateExport);
  functionCalls.push(contest.contestExport);
  functionCalls.push(contestResult.contestResultExport);
  functionCalls.push(customBallot.customBallotExport);
  functionCalls.push(evs.earlyVoteSitesExport);
  functionCalls.push(election.electionExport);
  functionCalls.push(electionAdmin.electionAdminExport);
  functionCalls.push(electionOfficial.electionOfficialExport);
  functionCalls.push(district.electoralDistrictExport);
  functionCalls.push(locality.localityExport);
  functionCalls.push(pollingLocation.pollingLocationExport);
  functionCalls.push(precinct.precinctExport);
  functionCalls.push(precinctSplit.precinctSplitExport);
  functionCalls.push(referendum.referendumExport);
  functionCalls.push(source.sourceExport);
  functionCalls.push(state.stateExport);
  functionCalls.push(streetSegment.streetSegmentExport);

  var stream = fs.createWriteStream('./exported-feeds/' + feedName + '.xml');
  writeFeed(feedId, stream);
}

function writeFeed(feedId, stream) {

  if(!once) {
    stream.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");

    stream.write("<vip_object xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"http://election-info-standard.googlecode.com/files/election_spec_v3.0.xsd\" schemaVersion=\"3.0\">");
    once = true;
  }

  function finishedWrite(err) {
    if (err)
      console.log(err);

    --written;

    if(written === 0) {
      if(finished) {
        stream.end();
        console.log('Finished writing XML');
        once = false;
        sent = 0;
        written = 0;
        finished = false;
      }
      else
        writeFeed(feedId, stream);
    }
  }

  function sendToBuffer(chunk) {
    if(chunk === -1) {
      writeFeed(feedId, stream);
      return;
    }

    ++written;
    stream.write(chunk, finishedWrite);
  }

  if(sent !== functionCalls.length)
    functionCalls[sent++](feedId, sendToBuffer);
  else {
    ++written;
    stream.write("</vip_object>", finishedWrite);
    finished = true;
    console.log('Finished adding to writing buffer');
  }
}

exports.createXml = createXml;