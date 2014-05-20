/**
 * Created by bantonides on 2/10/14.
 */

var dao = require('../dao/db');
var daoErrors = require('../dao/errors');
var daoSchemas = require('../dao/schemas');
var errorMapper = require('./mappers/errors');
var endOfLine = require('os').EOL;
var feedIdMapper = require('../feedIdMapper');
var _ = require('underscore');
var logger = (require('../logging/vip-winston')).Logger;


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
  daoErrors.precinctStreetSegmentErrors(feedIdMapper.getId(req.params.feedid), req.params.precinctid,
    mapAndReturnErrors.bind(undefined, res, req));
};

function precinctSplitStreetSegmentsErrorsGET(req, res) {
  daoErrors.precinctSplitStreetSegmentErrors(feedIdMapper.getId(req.params.feedid), req.params.splitid,
    mapAndReturnErrors.bind(undefined, res, req));
};

function stateErrorsGET(req, res) {
  daoErrors.stateErrors(feedIdMapper.getId(req.params.feedid), mapAndReturnErrors.bind(undefined, res, req));
};

function localityErrorsGET(req, res) {
  daoErrors.localityErrors(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
};

function precinctErrorsGET(req, res) {
  daoErrors.precinctErrors(feedIdMapper.getId(req.params.feedid), req.params.precinctid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function electoralDistrictErrorsGET(req, res) {
  daoErrors.electoralDistrictErrors(feedIdMapper.getId(req.params.feedid), req.params.districtid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function contestElectoralDistrictErrorsGET(req, res) {
  dao.feedContestElectoralDistrict(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, district) {
  daoErrors.electoralDistrictErrors(feedIdMapper.getId(req.params.feedid), district.elementId,
    mapAndReturnErrors.bind(undefined, res, req));
  });
}

function contestErrorsGET(req, res) {
  daoErrors.contestErrors(feedIdMapper.getId(req.params.feedid), req.params.contestid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function precinctSplitErrorsGET(req, res) {
  daoErrors.precinctSplitErrors(feedIdMapper.getId(req.params.feedid), req.params.splitid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function earlyVoteSiteErrorsGET(req, res) {
  daoErrors.earlyVoteSiteErrors(feedIdMapper.getId(req.params.feedid), req.params.evsid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function localityElectionAdminErrorsGET(req, res) {
  dao.feedLocalityElectionAdministration(feedIdMapper.getId(req.params.feedid), req.params.localityid, function(err, admin) {
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
  daoErrors.referendumErrors(feedIdMapper.getId(req.params.feedid), req.params.referendumid,
  mapAndReturnErrors.bind(undefined, res, req));
}

function candidateErrorsGET(req, res) {
  daoErrors.candidateErrors(feedIdMapper.getId(req.params.feedid), req.params.candidateid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function pollingLocErrorsGET(req, res) {
  daoErrors.pollingLocationErrors(feedIdMapper.getId(req.params.feedid), req.params.pollinglocationid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function ballotLineResultErrorsGET(req, res) {
  daoErrors.ballotLineResultErrors(feedIdMapper.getId(req.params.feedid), req.params.blrid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function contestResultErrorsGET(req, res) {
  dao.getContestResult(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, result) {
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

// This takes care of all the error indexes for the overview modules on the Feed Overview page
function errorIndexGET(req, res) {

  var map = {
    // overview errors on the Feed Overview - under Polling Locations
    "earlyvotesites": daoSchemas.models.earlyvotesites.Error,
    "electionadministrations": daoSchemas.models.electionadmins.Error,
    "electionofficials": daoSchemas.models.electionofficials.Error,
    "localities": daoSchemas.models.localitys.Error,
    "pollinglocations": daoSchemas.models.pollinglocations.Error,
    "precincts": daoSchemas.models.precincts.Error,
    "precinctsplits": daoSchemas.models.precinctsplits.Error,
    "streetsegments": daoSchemas.models.streetsegments.Error,

    // overview errors on the Feed Overview - under Contests
    "ballots": daoSchemas.models.ballots.Error,
    "candidates": daoSchemas.models.candidates.Error,
    "contests": daoSchemas.models.contests.Error,
    "electoraldistricts": daoSchemas.models.electoraldistricts.Error,
    "referenda": daoSchemas.models.referendums.Error,

    // overview errors on the Feed Overview - under Results
    "contestresults": daoSchemas.models.contestresults.Error,
    "ballotlineresults": daoSchemas.models.ballotlineresults.Error
  };

  // check the type
  if(map[req.params.type]!=undefined){

    daoErrors.errorIndex(feedIdMapper.getId(req.params.feedid), map[req.params.type],
      mapAndReturnErrors.bind(undefined, res, req));

  } else {
    logger.error("Invalid error index");
    res.send(500);
  }

}

function errorIndexLocalityEarlyVoteSiteGET(req, res) {
  daoErrors.errorIndexLocalityEarlyVoteSite(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexLocalityElectionAdministrationGET(req, res) {
  daoErrors.errorIndexLocalityElectionAdministration(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexLocalityPollingLocationsGET(req, res) {
  daoErrors.errorIndexLocalityPollingLocations(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexLocalityPrecinctSplitsGET(req, res) {
  daoErrors.errorIndexLocalityPrecinctSplits(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexLocalityPrecinctsGET(req, res) {
  daoErrors.errorIndexLocalityPrecincts(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexLocalityStreetSegmentsGET(req, res) {
  daoErrors.errorIndexLocalityStreetSegments(feedIdMapper.getId(req.params.feedid), req.params.localityid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexContestBallotGET(req, res) {
  daoErrors.errorIndexContestBallot(feedIdMapper.getId(req.params.feedid), req.params.contestid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexContestCandidatesGET(req, res) {
    daoErrors.errorIndexContestCandidates(feedIdMapper.getId(req.params.feedid), req.params.contestid,
      mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexContestElectoralDistrictGET(req, res) {
  daoErrors.errorIndexContestElectoralDistrict(feedIdMapper.getId(req.params.feedid), req.params.contestid,
    mapAndReturnErrors.bind(undefined, res, req));
}

function errorIndexContestReferendaGET(req, res) {
  daoErrors.errorIndexContestReferenda(feedIdMapper.getId(req.params.feedid), req.params.contestid,
    mapAndReturnErrors.bind(undefined, res, req));
}



function mapAndReturnErrors(res, req, err, errors) {

  if (err) {
    logger.error(err);
    res.send(500);
  }
  else {
    if(req.query.error_report !== undefined){
      // if we need to create an error report

      var error_code = req.query.error_code;

      if(error_code !== undefined){
        error_code = parseInt(error_code);
      }


      var delim = ",";
      var response = "";
      var feed = req.originalUrl.split("/")[3] + "";

      // making the feed name more friendly for a file name
      // ex: "2014-04-10-Ohio-Federal-xhskeishw" => "20140410OhioFederal"
      var fileNameFeed = feed.replace(/ /g, '');
      fileNameFeed = fileNameFeed.split("-");
      fileNameFeed.pop();
      fileNameFeed = fileNameFeed.join("-");
      fileNameFeed = fileNameFeed.replace(/-/g, '');

      var feederrors = errors.map(errorMapper.mapError);

      var filename = fileNameFeed + "-" + "FullErrorReport";

      // csv header
      response +=
        "#" + delim +
        "Feed" + delim +
        "Severity" + delim +
        "Title" + delim +
        "Details" + delim +
        "Reference" + endOfLine;

      var async = require('async');
      var count = 1;
      async.forEach(feederrors, function(feederror, errorComplete){
        // if our error_code is undefined then bring back all the errors, otherwise only the
        // errors for that specific error_code
        if(error_code!==undefined && error_code === feederror.error_code){
          filename = fileNameFeed + "-" +  feederror.title.replace(/ /g, '') + "ErrorReport";
        }

        if (error_code && feederror.error_code !== error_code) {
          errorComplete();
          return;
        }

        var index = 0;
        async.forEach(_.uniq(feederror.models), function(model, modelComplete) {
          var completeModel = require('mongoose').model(model);
          var stream = completeModel.find(feederror.searches[index++]).stream();

          stream.on('data', function(ref) {
            response +=
              makeCSVSafe((count++).toString(), delim) + delim +
              makeCSVSafe(feed, delim) + delim +
              makeCSVSafe(ref.severityText, delim) + delim +
              makeCSVSafe(ref.title, delim) + delim +
              makeCSVSafe(ref.details, delim) + delim +
              makeCSVSafe(ref.textualReference, delim) + endOfLine;
          });

          stream.on('close', function(err) {
            modelComplete();
          });

        }, function(err) {
          errorComplete();
        });

      }, function(err) {

        // send back errors in text/csv format for an error report
        res.header("Content-Disposition", "attachment; filename=" + filename + ".csv");
        res.setHeader('Content-type', 'text/csv');
        res.charset = 'UTF-8';
        res.write(response);
        res.end();
      });

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

// Feed Overview page overview modules
exports.errorIndexGET = errorIndexGET;

// A given Locality page overview modules
exports.errorIndexLocalityEarlyVoteSiteGET = errorIndexLocalityEarlyVoteSiteGET;
exports.errorIndexLocalityElectionAdministrationGET = errorIndexLocalityElectionAdministrationGET;
exports.errorIndexLocalityPollingLocationsGET = errorIndexLocalityPollingLocationsGET;
exports.errorIndexLocalityPrecinctSplitsGET = errorIndexLocalityPrecinctSplitsGET;
exports.errorIndexLocalityPrecinctsGET = errorIndexLocalityPrecinctsGET;
exports.errorIndexLocalityStreetSegmentsGET = errorIndexLocalityStreetSegmentsGET;

// A given Contest page overview modules
exports.errorIndexContestBallotGET = errorIndexContestBallotGET;
exports.errorIndexContestCandidatesGET = errorIndexContestCandidatesGET;
exports.errorIndexContestElectoralDistrictGET = errorIndexContestElectoralDistrictGET;
exports.errorIndexContestReferendaGET = errorIndexContestReferendaGET;
