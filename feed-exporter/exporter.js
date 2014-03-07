/**
 * Created by rcartier13 on 3/3/14.
 */

var genx = require('genx');
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

schemas.initSchemas(mongoose);
mongoose.connect(config.mongoose.connectionString);

var saved = 0;
var written = 0;
var finished = false;

var stopWriting = false;

var extraData = [];

// test_feed: 531900efd8bbe35611000004
// NC: 5318a551f42313fa0c000004
createXml(schemas.types.ObjectId('5318a551f42313fa0c000004'));

function createXml(feedId) {
  var writer = new genx.Writer();

  var stream = fs.createWriteStream('./test.xml');
  var namespace = writer.declareNamespace('http://election-info-standard.googlecode.com/files/election_spec_v3.0.xsd', '');
  var receiver = writer.startDocument();

  function finishedWrite(err) {

    if(err)
      console.log(err);

    --written;

    if(finished && written === 0) {

//      if(extraData.length)
//        clearBuffer()
//      else {
        stream.end();
        console.log('Finished writing to XML');
      //}
    }
  }

  writer.on('data', function(data) {
//    if(stopWriting) {
//      extraData.push(data);
//    }
//    else if(!
      stream.write(data, 'utf8', finishedWrite)//) {
//      stopWriting = true;
//    }
//    else
      ++written;
  });

//  function clearBuffer() {
//    for(var i = 0; i < extraData.length; ++i) {
//
//      if( !stream.write(extraData[i], 'utf8', finishedWrite) )
//        return;
//      else {
//        ++written;
//        extraData.shift();
//      }
//    }
//
//    stopWriting = false;
//  }
//
//  writer.on('drain', clearBuffer);

  function dataPushed() {
    --saved;
    console.log(saved + ' left');
    if(saved === 0) {
      receiver.endElement();
      finished = true;
      console.log('Finished adding to writing buffer');
    }
  }

  var vipFeed = writer.declareElement(namespace, 'vip_object');
  stream.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
  receiver.startElement(vipFeed);

  ++saved; ballot.ballotExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; ballotLineResult.ballotLineResultExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; ballotResponse.ballotResponseExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; candidate.candidateExport(feedId, writer, receiver, namespace, dataPushed)
  ++saved; contest.contestExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; contestResult.contestResultExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; customBallot.customBallotExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; evs.earlyVoteSitesExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; election.electionExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; electionAdmin.electionAdminExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; electionOfficial.electionOfficialExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; district.electoralDistrictExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; locality.localityExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; pollingLocation.pollingLocationExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; precinct.precinctExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; precinctSplit.precinctSplitExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; referendum.referendumExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; source.sourceExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; state.stateExport(feedId, writer, receiver, namespace, dataPushed);
  ++saved; streetSegment.streetSegmentExport(feedId, writer, receiver, namespace, dataPushed);
}



exports.createXml = createXml;