/**
 * Created by bantonides on 2/10/14.
 */
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