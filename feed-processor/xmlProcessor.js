/**
 * Created by bantonides on 12/26/13.
 */
const
  path = require('path'),
  unfold = require('when/unfold'),
  xstream = require('xml-stream'),
  config = require('../config');
  moment = require('moment');


//(schemas, filePath, fileName, filePath)
module.exports = function() {

  var recordCount = 0;
  var xml;

  var feedId;
  var schemaVersion;
  var models;

  var Ballot = require('./mappers/Ballot');
  var BallotLineResult = require('./mappers/BallotLineResult');
  var BallotResponse = require('./mappers/BallotResponse');
  var BallotStyle = require('./mappers/BallotStyle');
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
  var Party = require('./mappers/Party');
  var PollingLocation = require('./mappers/PollingLocation');
  var Precinct = require('./mappers/Precinct');
  var PrecinctSplit = require('./mappers/PrecinctSplit');
  var PrecinctSplitElectoralDistrict = require('./mappers/PrecinctSplitElectoralDistrict');
  var PrecinctSplitBallotStyle = require('./mappers/PrecinctSplitBallotStyle');
  var Referendum = require('./mappers/Referendum');
  var Source = require('./mappers/Source');
  var State = require('./mappers/State');
  var StreetSegment = require('./mappers/StreetSegment');

  var writeQue = [];
  var unfolding = false;

  var parsingComplete = false;

  /*
   * functions to move into base class
   */
  function startUnfold() {
    if (unfolding) {
      return;
    }

    xml.pause();

    console.log('Starting unfold');

    unfolding = true;
    unfold(unspool, condition, log, 0)
      .catch(function(err) {
        console.error (err);
      })
      .then(function() {
        console.log('unfold completed!!!!');
        xml.resume();
        completeCheck();
      });
  }

  function unspool(count) {
    var currentWrite = writeQue.shift();
    return [currentWrite, count++];
  }

  function condition(writes) {
    if (writeQue.length == 0) {
      console.log('condition = true');
      unfolding = false;
    }

    return writeQue.length == 0;
  }

  function log(data) {
    if (data) {
    } else { console.log('data null'); }
  }

  function completeCheck() {
    if (parsingComplete) {
      if (writeQue.length == 0) {
        console.log('Creating database relationships...');
        require('./matchMaker').createDBRelationships(feedId, models);
      }
      else {
        console.log(writeQue.length);
      }
    }
  }

  function onParsingEnd() {
    parsingComplete = true;
    console.log('Parsing Complete!');
    startUnfold();
  }

  function readXMLFromStream(xmlStream) {

    xml = xmlStream;

    xml.collect('early_vote_site_id');
    xml.collect('candidate_id');
    xml.collect('electoral_district_id');
    xml.collect('polling_location_id');
    xml.collect('ballot_response_id');
    xml.collect('referendum_id');

    xml.on('end', onParsingEnd);
    xml.on('startElement: vip_object', processFeedAttributes);
    xml.on('endElement: ballot', processBallotElement);
    xml.on('endElement: ballot_line_result', processBallotLineResultElement);
    xml.on('endElement: ballot_response', processBallotResponseElement);
    xml.on('endElement: ballot_style', processBallotStyleElement);
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
    xml.on('endElement: party', processPartyElement);
    xml.on('endElement: polling_location', processPollingLocationElement);
    xml.on('endElement: precinct', processPrecinctElement);
    xml.on('endElement: precinct_split', processPrecinctSplitElement);
    xml.on('endElement: precinct_split_electoral_district', processPrecinctSplitElectoralDistrictElement);
    xml.on('endElement: precinct_split_ballot_style', processPrecinctBallotStyleElement);
    xml.on('endElement: referendum', processReferendumElement);
    xml.on('endElement: source', processSourceElement);
    xml.on('endElement: state', processStateElement);
    xml.on('endElement: street_segment', processStreetSegmentElement);
  }

  function processFeedAttributes(vipObject) {
    schemaVersion = vipObject.$.schemaVersion;
  }

  function mapAndSave(model, element) {
    recordCount++;

    if(schemaVersion == '3.0') {
      if(model.mapXml3_0)
        model.mapXml3_0(element);
    }
    else
      model.mapXml5_0(element);

    model.trimStrings();
    var savePromise = model.save();

    if (savePromise) {
      writeQue.push(savePromise);
    }

    if (recordCount % 10000 == 0) {
      console.log('RecordCount: %d WriteQ: %d', recordCount, writeQue.length);
    }

    if (!unfolding && writeQue.length >= config.mongoose.maxWriteQueueLength) {
      startUnfold();
    }
  }

  function processBallotElement(ballot) {
    var model = new Ballot(models, feedId);
    mapAndSave(model, ballot);
  }

  function processBallotLineResultElement(ballotLineResult) {
    var model = new BallotLineResult(models, feedId);
    mapAndSave(model, ballotLineResult);
  }

  function processBallotResponseElement(ballotResponse) {
    var model = new BallotResponse(models, feedId);
    mapAndSave(model, ballotResponse);
  }

  function processBallotStyleElement(ballotStyle) {
    var model = new BallotStyle(models, feedId);
    mapAndSave(model, ballotStyle);
  }

  function processCandidateElement(candidate) {
    var model = new Candidate(models, feedId);
    mapAndSave(model, candidate);
  }

  function processContestElement(contest) {
    var model = new Contest(models, feedId);
    mapAndSave(model, contest);
  }

  function processContestResultElement(contestResult) {
    var model = new ContestResult(models, feedId);
    mapAndSave(model, contestResult);
  }

  function processCustomBallotElement(customBallot) {
    var model = new CustomBallot(models, feedId);
    mapAndSave(model, customBallot);
  }

  function processEarlyVoteSiteElement(earlyVoteSite) {
    var model = new EarlyVoteSite(models, feedId);
    mapAndSave(model, earlyVoteSite);
  }

  function processElectionElement(election) {
    var model = new Election(models, feedId);
    mapAndSave(model, election);
  }

  function processElectionAdministrationElement(electionAdmin) {
    var model = new ElectionAdministration(models, feedId);
    mapAndSave(model, electionAdmin);
  }

  function processElectionOfficialElement(official) {
    var model = new ElectionOfficial(models, feedId);
    mapAndSave(model, official);
  }

  function processElectoralDistrictElement(electoralDistrict) {
    var model = new ElectoralDistrict(models, feedId);
    mapAndSave(model, electoralDistrict);
  }

  function processLocalityElement(locality) {
    var model = new Locality(models, feedId);
    mapAndSave(model, locality);
  }

  function processPartyElement(party) {
    var model = new Party(models, feedId);
    mapAndSave(model, party);
  }

  function processPollingLocationElement(pollingLocation) {
    var model = new PollingLocation(models, feedId);
    mapAndSave(model, pollingLocation);
  }

  function processPrecinctElement(precinct) {
    var model = new Precinct(models, feedId);
    mapAndSave(model, precinct);
  }

  function processPrecinctSplitElement(precinctSplit) {
    var model = new PrecinctSplit(models, feedId);
    mapAndSave(model, precinctSplit);
  }

  function processPrecinctSplitElectoralDistrictElement(psElectoralDistrict) {
    var model = new PrecinctSplitElectoralDistrict(models, feedId);
    mapAndSave(model, psElectoralDistrict);
  }

  function processPrecinctBallotStyleElement(psBallotStyle) {
    var model = new PrecinctSplitBallotStyle(models, feedId);
    mapAndSave(model, psBallotStyle);
  }

  function processReferendumElement(referendum) {
    var model = new Referendum(models, feedId);
    mapAndSave(model, referendum);
  }

  function processSourceElement(source) {
    var model = new Source(models, feedId);
    mapAndSave(model, source);
  }

  function processStateElement(state) {
    var model = new State(models, feedId);
    mapAndSave(model, state);
  }

  function processStreetSegmentElement(streetSegment) {
    var model = new StreetSegment(models, feedId);
    mapAndSave(model, streetSegment);
  }

  return {
    processXml: function (schemas, filePath, fileName, fileStream) {

      models = schemas.models;

      feedId = schemas.types.ObjectId();
      console.log('FeedId = ' + feedId.toString());

      models.Feed.create({
        _id: feedId,
        complete: false,
        failed: false,
        completedOn: null,
        loadedOn: moment.utc(),
        feedPath: filePath,
        feedStatus: 'Parsing',
        name: fileName,
        friendlyId: null
      }, function(err, feed) {
        console.log('Wrote feed with id = ' + feed._id.toString());
      });

      // if we are a child process
      if (process.send) {
        // tell the parent about the feedid of the current feed being processed
        process.send({"messageId": 1, "feedId": feedId});
      }

      // (NOTE if child process) *** *** ***
      // If the processing fails it will get caught by the parent, but only
      // after the message in the send() statement above finishes as node is single threaded
      // Make sure the end target of the send() call above only does in memory operations and
      // no blocking I/O or asynchronous operations, which would break this pattern and require us
      // to wait for the send() calls execution to finish before starting the processing below.

      var xml = new xstream(fileStream);
      readXMLFromStream(xml);

    }
  };
};
