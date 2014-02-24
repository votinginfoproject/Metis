/**
 * Created by bantonides on 2/10/14.
 */

var dao = require('../dao/db');
var daoErrors = require('../dao/errors');
var errorMapper = require('./mappers/errors');

function allErrorsGET(req, res) {
  daoErrors.allErrors(req.params.feedid, mapAndReturnErrors.bind(undefined, res));
}

function sourceErrorsGET(req, res) {
  daoErrors.sourceErrors(req.params.feedid, mapAndReturnErrors.bind(undefined, res));
}

function electionErrorsGET(req, res) {
  daoErrors.electionErrors(req.params.feedid, mapAndReturnErrors.bind(undefined, res));
}

function precinctStreetSegmentsErrorsGET(req, res) {
  daoErrors.precinctStreetSegmentErrors(req.params.feedid, req.params.precinctid,
    mapAndReturnErrors.bind(undefined, res));
};

function precinctSplitStreetSegmentsErrorsGET(req, res) {
  daoErrors.precinctSplitStreetSegmentErrors(req.params.feedid, req.params.splitid,
    mapAndReturnErrors.bind(undefined, res));
};

function stateErrorsGET(req, res) {
  daoErrors.stateErrors(req.params.feedid, mapAndReturnErrors.bind(undefined, res));
};

function localityErrorsGET(req, res) {
  daoErrors.localityErrors(req.params.feedid, req.params.localityid,
    mapAndReturnErrors.bind(undefined, res));
};

function precinctErrorsGET(req, res) {
  daoErrors.precinctErrors(req.params.feedid, req.params.precinctid,
    mapAndReturnErrors.bind(undefined, res));
}

function electoralDistrictErrorsGET(req, res) {
  daoErrors.electoralDistrictErrors(req.params.feedid, req.params.districtid,
    mapAndReturnErrors.bind(undefined, res));
}

function contestElectoralDistrictErrorsGET(req, res) {
  daoErrors.electoralDistrictErrors(req.params.feedid, req.params.contestid,
    mapAndReturnErrors.bind(undefined, res));
}

function contestErrorsGET(req, res) {
  daoErrors.contestErrors(req.params.feedid, req.params.contestid,
    mapAndReturnErrors.bind(undefined, res));
}

function precinctSplitErrorsGET(req, res) {
  daoErrors.precinctSplitErrors(req.params.feedid, req.params.splitid,
    mapAndReturnErrors.bind(undefined, res));
}

function earlyVoteSiteErrorsGET(req, res) {
  daoErrors.earlyVoteSiteErrors(req.params.feedid, req.params.evsid,
    mapAndReturnErrors.bind(undefined, res));
}

function localityElectionAdminErrorsGET(req, res) {
  dao.feedLocalityElectionAdministration(req.params.feedid, req.params.localityid, function(err, admin) {
    daoErrors.electionAdminErrors(req.params.feedid, admin._id, mapAndReturnErrors.bind(undefined, res));
  });
}

function stateElectionAdminErrorsGET(req, res) {
  dao.feedStateElectionAdministration(req.params.feedid, function(err, admin) {
    daoErrors.electionAdminErrors(req.params.feedid, admin._id, mapAndReturnErrors.bind(undefined, res));
  });
}

function ballotErrorsGET(req, res) {
  daoErrors.ballotErrors(req.params.feedid, req.params.contestid,
    mapAndReturnErrors.bind(undefined, res));
}

function ballotLineResultErrorsGET(req, res) {
  daoErrors.ballotLineResultErrors(req.params.feedid, req.params.contestid,
    mapAndReturnErrors.bind(undefined, res));
}

function contestResultErrorsGET(req, res) {
  daoErrors.contestResultErrors(req.params.feedid, req.params.contestid,
    mapAndReturnErrors.bind(undefined, res));
}

function referendumErrorsGET(req, res) {
  daoErrors.referendumErrors(req.params.feedid, req.params.referendumid,
  mapAndReturnErrors.bind(undefined, res));
}

function candidateErrorsGET(req, res) {
  daoErrors.candidateErrors(req.params.feedid, req.params.candidateid,
    mapAndReturnErrors.bind(undefined, res));
}

function pollingLocErrorsGET(req, res) {
  daoErrors.pollingLocationErrors(req.params.feedid, req.params.localityid,
    mapAndReturnErrors.bind(undefined, res));
}

function ballotLineResultErrorsGET(req, res) {
  daoErrors.ballotLineResultErrors(req.params.feedid, req.params.blrid,
    mapAndReturnErrors.bind(undefined, res));
}

function contestResultErrorsGET(req, res) {
  dao.getContestResult(req.params.feedid, req.params.contestid, function(err, result) {
    daoErrors.contestResultErrors(req.params.feedid, result._id, mapAndReturnErrors.bind(undefined, res));
  });
}

function mapAndReturnErrors(res, err, errors) {
  if (err) {
    console.error(err);
    res.send(500);
  }
  else {
    res.json(errors.map(errorMapper.mapError));
  }
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
exports.ballotLineResultErrorsGET = ballotLineResultErrorsGET;
exports.contestResultErrorsGET = contestResultErrorsGET;
