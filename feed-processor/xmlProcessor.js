/**
 * Created by bantonides on 12/26/13.
 */
const
  path = require('path'),
  unfold = require('when/unfold'),
  xstream = require('xml-stream'),
  config = require('../config'),
  moment = require('moment');


//(schemas, filePath, fileName, filePath)
module.exports = function() {

  var recordCount = 0;
  var xml;

  var feedId;
  var schemaVersion;
  var models;
  var schemas;

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

  var stopProcessing = false;
  var parsingComplete = false;

  var logger = (require('../logging/vip-winston')).Logger;

  /*
   * functions to move into base class
   */
  function startUnfold() {
    if (unfolding) {
      return;
    }

    xml.pause();

    logger.info('Starting unfold');

    unfolding = true;
    unfold(unspool, condition, log, 0)
      .catch(function(err) {
        console.error (err);
      })
      .then(function() {
        logger.info('unfold completed!!!!');
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
      logger.info('condition = true');
      unfolding = false;
    }

    return writeQue.length == 0;
  }

  function log(data) {
    if (data) {
    } else { logger.info('data null'); }
  }

  function completeCheck() {
    if (parsingComplete) {
      if (writeQue.length == 0) {
        logger.info('Creating database relationships...');
        require('./matchMaker').createDBRelationships(feedId, models, schemaVersion);
      }
      else {
        logger.info(writeQue.length);
      }
    }
  }

  function onParsingEnd() {
    parsingComplete = true;
    logger.info('Parsing Complete!');
    startUnfold();
  }

  function readXMLFromStream(xmlStream, fileName, errorFn) {

    xml = xmlStream;

    xml.collect('early_vote_site_id');
    xml.collect('candidate_id');
    xml.collect('electoral_district_id');
    xml.collect('polling_location_id');
    xml.collect('ballot_response_id');
    xml.collect('referendum_id');
    xml.collect('pollbook_type');
    xml.collect('contest_id');

    xml.collect('contest');
    xml.collect('candidates');

    xml.on('end', onParsingEnd);
    xml.on('startElement: vip_object', trap(processFeedAttributes));
    xml.on('endElement: ballot', trap(processBallotElement));
    xml.on('endElement: ballot_line_result', trap(processBallotLineResultElement));
    xml.on('endElement: ballot_response', trap(processBallotResponseElement));
    xml.on('endElement: ballot_style', trap(processBallotStyleElement));
    xml.on('endElement: candidate', trap(processCandidateElement));
    xml.on('endElement: contest', trap(processContestElement));
    xml.on('endElement: contest_result', trap(processContestResultElement));
    xml.on('endElement: custom_ballot', trap(processCustomBallotElement));
    xml.on('endElement: early_vote_site', trap(processEarlyVoteSiteElement));
    xml.on('endElement: election', trap(processElectionElement));
    xml.on('endElement: election_administration', trap(processElectionAdministrationElement));
    xml.on('endElement: election_official', trap(processElectionOfficialElement));
    xml.on('endElement: electoral_district', trap(processElectoralDistrictElement));
    xml.on('endElement: locality', trap(processLocalityElement));
    xml.on('endElement: party', trap(processPartyElement));
    xml.on('endElement: polling_location', trap(processPollingLocationElement));
    xml.on('endElement: precinct', trap(processPrecinctElement));
    xml.on('endElement: precinct_split', trap(processPrecinctSplitElement));
    xml.on('endElement: precinct_split_ballot_style', trap(processPrecinctBallotStyleElement));
    xml.on('endElement: referendum', trap(processReferendumElement));
    xml.on('endElement: source', trap(processSourceElement));
    xml.on('endElement: state', trap(processStateElement));
    xml.on('endElement: street_segment', trap(processStreetSegmentElement));
    //Tried using xml.on, but the fn appears to be broke when dealing with non-parsed events,
    //yay for libraries without testing. #once comes from the events module, which is the
    //parent class
    xml.once('error', function(error) {
      stopProcessing = true;
      errorFn({"errorMessage": error.message,
               "stack": error.stack,
               "fileName": fileName});
    });
  }

  //Because we have to use the #once emitter, we have to stop processing like with CSVs
  function trap(processFn){
    return function(model, element) {
      if(stopProcessing == false) {
        processFn(model, element);
      }
    }
  }

  function processFeedAttributes(vipObject) {
    schemaVersion = vipObject.$.schemaVersion;

    if(schemaVersion == '5.0') {
      xml.collect('precinct');
      xml.collect('precinct_split');
      xml.collect('polling_location');
      xml.collect('candidate');
    }
  }

  function mapAndSave(model, element) {
    recordCount++;

    if(schemaVersion == '3.0') {
      if(model.mapXml3_0)
        model.mapXml3_0(element);
    }
    else
      model.mapXml5_0(element);

    var savePromise = model.save();

    if (savePromise) {
      writeQue.push(savePromise);
    }

    if (recordCount % 10000 == 0) {
      logger.info('RecordCount: %d WriteQ: %d', recordCount, writeQue.length);
    }

    if (!unfolding && writeQue.length >= config.mongoose.maxWriteQueueLength) {
      startUnfold();
    }

    if(model.model)
      return model.model._id;
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

    if(schemaVersion == '5.0')
      return;

    var model = new Candidate(models, feedId);
    mapAndSave(model, candidate);
  }

  function processContestElement(contest) {

    if(!contest.$.id)
      return;

    if(schemaVersion == '5.0') {
      if(contest.candidate) {
        contest.candidate.forEach(function (candidate) {
          var candidateModel = new Candidate(models, feedId);
          var candidateId = new schemas.types.ObjectId();
          candidate.ballot_id = contest.ballot_id;
          mapAndSave(candidateModel, candidate, candidateId);
        });
      }
    }

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

    if(schemaVersion == '5.0') {
      locality.precinct.forEach(function (precinct) {

        if(precinct.precinct_split) {
          precinct._precinctSplits = [];
          precinct.precinct_split.forEach(function (split) {
            var splitModel = new PrecinctSplit(models, feedId);
            precinct._precinctSplits.push(mapAndSave(splitModel, split));
          });
        }

        if(precinct.polling_location) {
          precinct._pollingLocations = [];
          precinct.polling_location.forEach(function (location) {
            var locationModel = new PollingLocation(models, feedId);
            var locationId = new schemas.types.ObjectId();
            precinct._pollingLocations.push(mapAndSave(locationModel, location, locationId));
          });
        }

        locality._precincts = [];
        var precinctModel = new Precinct(models, feedId);
        var precinctId = new schemas.types.ObjectId();
        locality._precincts.push(mapAndSave(precinctModel, precinct, precinctId));
      });
    }

    var model = new Locality(models, feedId);
    mapAndSave(model, locality);
  }

  function processPartyElement(party) {
    if(schemaVersion == '5.0') {
      var model = new Party(models, feedId);
      mapAndSave(model, party);
    }
  }

  function processPollingLocationElement(pollingLocation) {

    if(schemaVersion == '5.0')
      return;

    var model = new PollingLocation(models, feedId);
    mapAndSave(model, pollingLocation);
  }

  function processPrecinctElement(precinct) {

    if(schemaVersion == '5.0')
      return;

    var model = new Precinct(models, feedId);
    mapAndSave(model, precinct);
  }

  function processPrecinctSplitElement(precinctSplit) {

    if(schemaVersion == '5.0')
      return;

    var model = new PrecinctSplit(models, feedId);
    mapAndSave(model, precinctSplit);
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
    processXml: function (_schemas, filePath, fileName, fileStream, errorFn) {
      schemas = _schemas;
      models = schemas.models;

      feedId = schemas.types.ObjectId();
      logger.info('FeedId = ' + feedId.toString());

      models.feeds.create({
        _id: feedId.toString(),
        complete: false,
        failed: false,
        completedOn: null,
        loadedOn: moment.utc(),
        feedPath: filePath,
        feedStatus: 'Parsing',
        name: fileName,
        friendlyId: null
      }, function(err, feed) {
        logger.info('Wrote feed with id = ' + feed._id.toString());
      });

      // if we are a child process
      if (process.send) {
        // tell the parent about the feedid of the current feed being processed
        process.send({"messageId": 1, "feedId": feedId.toString()});
      }

      // (NOTE if child process) *** *** ***
      // If the processing fails it will get caught by the parent, but only
      // after the message in the send() statement above finishes as node is single threaded
      // Make sure the end target of the send() call above only does in memory operations and
      // no blocking I/O or asynchronous operations, which would break this pattern and require us
      // to wait for the send() calls execution to finish before starting the processing below.

      var xml = new xstream(fileStream);
      readXMLFromStream(xml, fileName, errorFn);
    }
  };
};
