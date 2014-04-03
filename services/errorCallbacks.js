/**
 * Created by bantonides on 2/10/14.
 */

var dao = require('../dao/db');
var daoErrors = require('../dao/errors');
var daoSchemas = require('../dao/schemas');
var errorMapper = require('./mappers/errors');
var endOfLine = require('os').EOL;
var feedIdMapper = require('../feedIdMapper');

function allErrorsGET(req, res) {
  daoErrors.allErrors(feedIdMapper.getId(req.params.feedid), mapAndReturnErrors.bind(undefined, res, req));
}

function sourceErrorsGET(req, res) {
  daoErrors.sourceErrors(feedIdMapper.getId(req.params.feedid), mapAndReturnErrors.bind(undefined, res, req));
}

function electionErrorsGET(req, res) {
  daoErrors.electionErrors(feedIdMapper.getId(req.params.feedid), mapAndReturnErrors.bind(undefined, res, req));
}

function precinctStreetSegmentsErrorsGET(req, res) {
  daoErrors.precinctStreetSegmentErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.precinctid),
    mapAndReturnErrors.bind(undefined, res, req));
};

function precinctSplitStreetSegmentsErrorsGET(req, res) {
  daoErrors.precinctSplitStreetSegmentErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.splitid),
    mapAndReturnErrors.bind(undefined, res, req));
};

function stateErrorsGET(req, res) {
  daoErrors.stateErrors(feedIdMapper.getId(req.params.feedid), mapAndReturnErrors.bind(undefined, res, req));
};

function localityErrorsGET(req, res) {
  daoErrors.localityErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.localityid),
    mapAndReturnErrors.bind(undefined, res, req));
};

function precinctErrorsGET(req, res) {
  daoErrors.precinctErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.precinctid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function electoralDistrictErrorsGET(req, res) {
  daoErrors.electoralDistrictErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.districtid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function contestElectoralDistrictErrorsGET(req, res) {
  dao.feedContestElectoralDistrict(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, district) {
  daoErrors.electoralDistrictErrors(feedIdMapper.getId(req.params.feedid), district.elementId,
    mapAndReturnErrors.bind(undefined, res, req));
  });
}

function contestErrorsGET(req, res) {
  daoErrors.contestErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.contestid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function precinctSplitErrorsGET(req, res) {
  daoErrors.precinctSplitErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.splitid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function earlyVoteSiteErrorsGET(req, res) {
  daoErrors.earlyVoteSiteErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.evsid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function localityElectionAdminErrorsGET(req, res) {
  dao.feedLocalityElectionAdministration(feedIdMapper.getId(req.params.feedid), parseInt(req.params.localityid), function(err, admin) {
    daoErrors.electionAdminErrors(feedIdMapper.getId(req.params.feedid), admin.elementId, mapAndReturnErrors.bind(undefined, res, req));
  });
}

function stateElectionAdminErrorsGET(req, res) {
  dao.feedStateElectionAdministration(feedIdMapper.getId(req.params.feedid), function(err, admin) {
    daoErrors.electionAdminErrors(feedIdMapper.getId(req.params.feedid), admin.elementId, mapAndReturnErrors.bind(undefined, res, req));
  });
}

function ballotErrorsGET(req, res) {
  dao.feedContestBallot(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, ballot) {
    daoErrors.ballotErrors(feedIdMapper.getId(req.params.feedid), ballot.elementId,
      mapAndReturnErrors.bind(undefined, res, req));
  });
}

function referendumErrorsGET(req, res) {
  daoErrors.referendumErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.referendumid),
  mapAndReturnErrors.bind(undefined, res, req));
}

function candidateErrorsGET(req, res) {
  daoErrors.candidateErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.candidateid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function pollingLocErrorsGET(req, res) {
  daoErrors.pollingLocationErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.pollinglocationid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function ballotLineResultErrorsGET(req, res) {
  daoErrors.ballotLineResultErrors(feedIdMapper.getId(req.params.feedid), parseInt(req.params.blrid),
    mapAndReturnErrors.bind(undefined, res, req));
}

function contestResultErrorsGET(req, res) {
  dao.getContestResult(feedIdMapper.getId(req.params.feedid), parseInt(req.params.contestid), function(err, result) {
    daoErrors.contestResultErrors(feedIdMapper.getId(req.params.feedid), result._id, mapAndReturnErrors.bind(undefined, res, req));
  });
}

function ballotCustomBallotErrorsGET(req, res) {
  dao.feedContestBallot(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, ballot) {
    daoErrors.customBallotErrors(feedIdMapper.getId(req.params.feedid), ballot._customBallot.elementId, mapAndReturnErrors.bind(undefined, res));
  });
}

function ballotBallotResponsesErrorsGET(req, res) {
  dao.feedContestBallot(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, ballot) {
    var responses = ballot._customBallot.ballotResponses.map(function(response) { return response._response.elementId; });
    daoErrors.ballotResponseErrors(feedIdMapper.getId(req.params.feedid), responses, mapAndReturnErrors.bind(undefined, res));
  });
}

function referendumBallotResponsesErrorsGET(req, res) {
  dao.feedBallotReferendum(feedIdMapper.getId(req.params.feedid), req.params.referendumid, function(err, referendum) {
    var responses = referendum.ballotResponses.map(function(response) { return response._response.elementId; });
    daoErrors.ballotResponseErrors(feedIdMapper.getId(req.params.feedid), responses, mapAndReturnErrors.bind(undefined, res));
  });
}

function errorIndexGET(req, res) {

  var map = {
    // overview errors on the Feed Overview - under Polling Locations
    "earlyvotesites": daoSchemas.models.EarlyVoteSite.Error,
    "electionadministrations": daoSchemas.models.ElectionAdmin.Error,
    "electionofficials": daoSchemas.models.ElectionOfficial.Error,
    "localities": daoSchemas.models.Locality.Error,
    "pollinglocations": daoSchemas.models.PollingLocation.Error,
    "precincts": daoSchemas.models.Precinct.Error,
    "precinctsplits": daoSchemas.models.PrecinctSplit.Error,
    "streetsegments": daoSchemas.models.StreetSegment.Error,

    // overview errors on the Feed Overview - under Contests
    "ballots": daoSchemas.models.Ballot.Error,
    "candidates": daoSchemas.models.Candidate.Error,
    "contests": daoSchemas.models.Contest.Error,
    "electoraldistricts": daoSchemas.models.ElectoralDistrict.Error,
    "referenda": daoSchemas.models.Referendum.Error,

    // overview errors on the Feed Overview - under Results
    "contestresults": daoSchemas.models.ContestResult.Error,
    "ballotlineresults": daoSchemas.models.BallotLineResult.Error
  };

  // check the type
  if(map[req.params.type]!=undefined){

    daoErrors.errorIndex(feedIdMapper.getId(req.params.feedid), map[req.params.type],
      mapAndReturnErrors.bind(undefined, res, req));

  } else {
    console.error("Invalid error index");
    res.send(500);
  }

}


function mapAndReturnErrors(res, req, err, errors) {

  if (err) {
    console.error(err);
    res.send(500);
  }
  else {
    if(req.query.error_report !== undefined){
      // if we need to create an error report

      var error_code = req.query.error_code;

      if(error_code !== undefined){
        error_code = parseInt(error_code);
      }

      var filename = "FullErrorReport";

      var delim = ",";
      var response = "";
      var feed = req.originalUrl.split("/")[3];
      var feederrors = errors.map(errorMapper.mapError);

      // csv header
      response +=
        "#" + delim +
        "Feed" + delim +
        "Severity" + delim +
        "Title" + delim +
        "Details" + delim +
        "Reference" + endOfLine;

      var count = 1;
      for(var i=0; i< feederrors.length; i++){
        var feederror = feederrors[i];

        // if our error_code is undefined then bring back all the errors, otherwise only the
        // errors for that specific error_code
        if(error_code === undefined || (error_code!==undefined && error_code === feederror.error_code)) {

          if(error_code!==undefined){
            filename = feederror.title.replace(/ /g, '') + "ErrorReport";
          }

          for(var j=0; j< feederror.textual_references.length; j++){
            response +=
              makeCSVSafe((count++).toString(), delim) + delim +
              makeCSVSafe(feed, delim) + delim +
              makeCSVSafe(feederror.severity_text, delim) + delim +
              makeCSVSafe(feederror.title, delim) + delim +
              makeCSVSafe(feederror.details, delim) + delim +
              makeCSVSafe(feederror.textual_references[j], delim) + endOfLine;
          }
        }
      }

      // send back errors in text/csv format for an error report
      res.header("Content-Disposition", "attachment; filename=" + filename + ".csv");
      res.setHeader('Content-type', 'text/csv');
      res.charset = 'UTF-8';
      res.write(response);
      res.end();

    } else {
      // send back errors in json format for the page
      res.json(errors.map(errorMapper.mapError));
    }

  }
}

function makeCSVSafe(value, delim){
  // the delim is in our value we need to put quotes around our value
  if(value.indexOf(delim)!==-1){

    // if we are putting quotes around our value, we need to escape any existing quotes first
    value = value.replace(/"/g, '""');

    value = '"' + value + '"';
  }

  return value;
}

exports.allErrorsGET = allErrorsGET;
exports.sourceErrorsGET = sourceErrorsGET;
exports.electionErrorsGET = electionErrorsGET;
exports.precinctStreetSegmentsErrorsGET = precinctStreetSegmentsErrorsGET;
exports.precinctSplitStreetSegmentsErrorsGET = precinctSplitStreetSegmentsErrorsGET;
exports.stateErrorsGET = stateErrorsGET;
exports.localityErrorsGET = localityErrorsGET;
exports.precinctErrorsGET = precinctErrorsGET;
exports.electoralDistrictErrorsGET = electoralDistrictErrorsGET;
exports.contestElectoralDistrictErrorsGET = contestElectoralDistrictErrorsGET;
exports.contestErrorsGET = contestErrorsGET;
exports.precinctSplitErrorsGET = precinctSplitErrorsGET;
exports.earlyVoteSiteErrorsGET = earlyVoteSiteErrorsGET;
exports.localityElectionAdminErrorsGET = localityElectionAdminErrorsGET;
exports.stateElectionAdminErrorsGET = stateElectionAdminErrorsGET;
exports.ballotErrorsGET = ballotErrorsGET;
exports.ballotLineResultErrorsGET = ballotLineResultErrorsGET;
exports.contestResultErrorsGET = contestResultErrorsGET;
exports.referendumErrorsGET = referendumErrorsGET;
exports.candidateErrorsGET = candidateErrorsGET;
exports.pollingLocErrorsGET = pollingLocErrorsGET;
exports.ballotCustomBallotErrorsGET = ballotCustomBallotErrorsGET;
exports.ballotBallotResponsesErrorsGET = ballotBallotResponsesErrorsGET;
exports.referendumBallotResponsesErrorsGET = referendumBallotResponsesErrorsGET;

exports.errorIndexGET = errorIndexGET;
