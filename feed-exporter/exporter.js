/**
 * Created by rcartier13 on 3/3/14.
 */
var logger = (require('../logging/vip-winston')).Logger;
var auth = require('../services/auth');

var db = require('../dao/db');
var fs = require('fs');

var config = require('../config');

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
var moment = require('moment');
var AdmZip = require('adm-zip');

function Instance() {
  return {
    once: false,
    sent: 0,
    written: 0,
    finished: false,
    streetSegmentCallback: null,
    stream: null,
    zip: null,
    tempLoc: null,
    zipLoc: null
  }
}

var functionCalls = [
  ballot.ballotExport,
  ballotLineResult.ballotLineResultExport,
  ballotResponse.ballotResponseExport,
  candidate.candidateExport,
  contest.contestExport,
  contestResult.contestResultExport,
  customBallot.customBallotExport,
  evs.earlyVoteSitesExport,
  election.electionExport,
  electionAdmin.electionAdminExport,
  electionOfficial.electionOfficialExport,
  district.electoralDistrictExport,
  locality.localityExport,
  pollingLocation.pollingLocationExport,
  precinct.precinctExport,
  precinctSplit.precinctSplitExport,
  referendum.referendumExport,
  source.sourceExport,
  state.stateExport,
  streetSegment.streetSegmentExport
];

function createXml(feedId, feedName, feedFolder, instance, callback) {

  if(instance.stream != null) {
    callback(400);
    return;
  }

  var folderName = feedFolder;
  instance.tempLoc = './temp/' + feedName + '.xml';
  instance.zipLoc = './feeds/' + folderName + '/' + feedName + '.zip';

  if( !fs.existsSync(config.exporter.dirLocation) )
    fs.mkdirSync(config.exporter.dirLocation);

  if( !fs.existsSync(config.exporter.dirLocation + '/' + folderName) )
    fs.mkdirSync(config.exporter.dirLocation + '/' + folderName);

  if( !fs.existsSync(config.exporter.tempLocation) )
    fs.mkdirSync(config.exporter.tempLocation);

  instance.stream = fs.createWriteStream(instance.tempLoc);
  instance.zip = new AdmZip();
  callback(undefined, instance.zipLoc);
  writeFeed(feedId, instance, function(err) {
    callback(err);
  });
}

function writeFeed(feedId, instance, callback) {

  if(!instance.once) {
    instance.stream.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");

    instance.stream.write("<vip_object xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"http://election-info-standard.googlecode.com/files/election_spec_v3.0.xsd\" schemaVersion=\"3.0\">\n");
    instance.once = true;
  }

  function finishedWrite(err) {
    if (err) {
      callback(err);
    }

    --instance.written;

    if(instance.written === 0) {
      if(instance.finished) {
        instance.stream.end();
        logger.info('---------------------------------');
        logger.info('Finished writing XML');
        logger.info('***Zip XML***');
        instance.zip.addLocalFile(instance.tempLoc);
        instance.zip.writeZip(instance.zipLoc);
        fs.unlinkSync(instance.tempLoc);
        fs.rmdirSync(config.exporter.tempLocation);
        logger.info('***Zip Finished***');

        var output = {
          FeedFile: instance.zipLoc,
          DateTime: moment().utc().toString(),
          FeedId: feedId,
          User: auth.getCurrentUser().name.givenName + " " + auth.getCurrentUser().name.familyName,
          UserName: auth.getCurrentUser().username,
          UserEmail: auth.getCurrentUser().email
        };

        logger.info("Feed Approved: ", output);

      }
      else if(instance.streetSegmentCallback)
        instance.streetSegmentCallback();
      else
        writeFeed(feedId, instance, callback);
    }
  }

  function sendToBuffer(chunk, strSegCallback) {
    if(chunk === -1) {
      writeFeed(feedId, instance, callback);
      return true;
    }

    ++instance.written;
    if( !instance.stream.write(chunk, finishedWrite) ) {
      instance.streetSegmentCallback = strSegCallback;
      return false;
    }
    return true;
  }

  if(instance.sent !== functionCalls.length)
    functionCalls[instance.sent++](feedId, sendToBuffer);
  else {
    ++instance.written;
    instance.stream.write("</vip_object>", finishedWrite);
    instance.finished = true;
    logger.info('Finished adding to writing buffer');
  }
}

exports.Instance = Instance;
exports.createXml = createXml;