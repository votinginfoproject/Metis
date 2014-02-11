/**
 * Created by bantonides on 2/10/14.
 */
var daoSchemas = require('./schemas');
var when = require('when');

function allErrors(feedId, callback) {
  var allErrorModels = [daoSchemas.models.Ballot.Error,
    daoSchemas.models.BallotResponse.Error,
    daoSchemas.models.BallotLineResult.Error,
    daoSchemas.models.Candidate.Error,
    daoSchemas.models.Contest.Error,
    daoSchemas.models.ContestResult.Error,
    daoSchemas.models.CustomBallot.Error,
    daoSchemas.models.EarlyVoteSite.Error,
    daoSchemas.models.Election.Error,
    daoSchemas.models.ElectionAdmin.Error,
    daoSchemas.models.ElectionOfficial.Error,
    daoSchemas.models.ElectoralDistrict.Error,
    daoSchemas.models.Locality.Error,
    daoSchemas.models.PollingLocation.Error,
    daoSchemas.models.Precinct.Error,
    daoSchemas.models.PrecinctSplit.Error,
    daoSchemas.models.Referendum.Error,
    daoSchemas.models.Source.Error,
    daoSchemas.models.State.Error,
    daoSchemas.models.StreetSegment.Error];

  var errorQueries = allErrorModels.map(function (model) {
    return model.find({ _feed: feedId }).exec();
  });

  when.all(errorQueries).then(function (errors) {
    callback(null, concatErrors(errors));
  }, callback);
}

function ballotErrors(feedId, contestId, callback) {
  daoSchemas.models.Ballot.Error.find({ _feed: feedId, refElementId: contestId }, callback);
}

function ballotLineResultErrors(feedId, ballotLineResultId, callback) {
  daoSchemas.models.BallotLineResult.Error.find({ _feed: feedId, refElementId: ballotLineResultId }, callback);
}

function candidateErrors(feedId, candidateId, callback) {
  daoSchemas.models.Candidate.Error.find({ _feed: feedId, refElementId: candidateId }, callback);
}

function contestErrors(feedId, contestId, callback) {
  daoSchemas.models.Contest.Error.find({ _feed: feedId, refElementId: contestId }, callback);
}

function contestResultErrors(feedId, contestId, callback) {
  daoSchemas.models.ContestResult.Error.find({ _feed: feedId, refElementId: contestId }, callback);
}

function customBallotErrors(feedId, customBallotId, callback) {
  daoSchemas.models.CustomBallot.Error.find({ _feed: feedId, refElementId: customBallotId }, callback);
}

function earlyVoteSiteErrors(feedId, earlyVoteSiteId, callback) {
  daoSchemas.models.EarlyVoteSite.Error.find({ _feed: feedId, refElementId: earlyVoteSiteId }, callback);
}

function electionErrors(feedId, callback) {
  daoSchemas.models.Election.Error.find({ _feed: feedId }, callback);
}

function electionAdminErrors(feedId, electionAdminId, callback) {
  daoSchemas.models.ElectionAdmin.Error.find({ _feed: feedId, refElementId: electionAdminId }, callback);
}

function electionOfficialErrors(feedId, electionOfficialId, callback) {
  daoSchemas.models.ElectionOfficial.Error.find({ _feed: feedId, refElementId: electionOfficialId }, callback);
}

function electoralDistrictErrors(feedId, electoralDistrictId, callback) {
  daoSchemas.models.ElectoralDistrict.Error.find({ _feed: feedId, refElementId: electoralDistrictId }, callback);
}

function localityErrors(feedId, localityId, callback) {
  daoSchemas.models.Locality.Error.find({ _feed: feedId, refElementId: localityId }, callback);
}

function pollingLocationErrors(feedId, pollingLocationId, callback) {
  daoSchemas.models.PollingLocation.Error.find({ _feed: feedId, refElementId: pollingLocationId }, callback);
}

function precinctErrors(feedId, precinctId, callback) {
  daoSchemas.models.Precinct.Error.find({ _feed: feedId, refElementId: precinctId }, callback);
}

function precinctSplitErrors(feedId, precintSplitId, callback) {
  daoSchemas.models.PrecinctSplit.Error.find({ _feed: feedId, refElementId: precintSplitId }, callback);
}

function referendumErrors(feedId, referendumId, callback) {
  daoSchemas.models.Referendum.Error.find({ _feed: feedId, refElementId: referendumId }, callback);
}

function sourceErrors(feedId, callback) {
  daoSchemas.models.Source.Error.find({ _feed: feedId }, callback);
}

function stateErrors(feedId, callback) {
  daoSchemas.models.State.Error.find({ _feed: feedId }, callback);
}

function precinctStreetSegmentErrors(feedId, precinctId, callback) {
  var promise = daoSchemas.models.Precinct
    .findOne({ _feed: feedId, elementId: precinctId })
    .select('_streetSegments')
    .exec();

  promise.then(function(precinct) {
    daoSchemas.models.StreetSegment.Error.find({ _feed: feedId, _ref: { $in: precinct._streetSegments } }, callback);
  });
}

function precinctSplitStreetSegmentErrors(feedId, precinctSplitId, callback) {
  var promise = daoSchemas.models.PrecinctSplit
    .findOne({ _feed: feedId, elementId: precinctSplitId })
    .select('_streetSegments')
    .exec();

  promise.then(function(precinctSplit) {
    daoSchemas.models.StreetSegment.Error.find({ _feed: feedId, _ref: { $in: precinctSplit._streetSegments } }, callback);
  });
}

function concatErrors(errors) {
  return Array.prototype.concat.apply([], errors);
}

exports.allErrors = allErrors;
exports.sourceErrors = sourceErrors;
exports.ballotErrors = ballotErrors;
exports.ballotLineResultErrors = ballotLineResultErrors;
exports.candidateErrors = candidateErrors;
exports.contestErrors = contestErrors;
exports.contestResultErrors = contestResultErrors;
exports.customBallotErrors = customBallotErrors
exports.earlyVoteSiteErrors = earlyVoteSiteErrors;
exports.electionErrors = electionErrors;
exports.electionAdminErrors = electionAdminErrors;
exports.electionOfficialErrors = electionOfficialErrors;
exports.electoralDistrictErrors = electoralDistrictErrors
exports.localityErrors = localityErrors;
exports.pollingLocationErrors = pollingLocationErrors;
exports.precinctErrors = precinctErrors;
exports.precinctSplitErrors = precinctSplitErrors;
exports.referendumErrors = referendumErrors;
exports.sourceErrors = sourceErrors;
exports.stateErrors = stateErrors;
exports.precinctStreetSegmentErrors = precinctStreetSegmentErrors;
exports.precinctSplitStreetSegmentErrors = precinctSplitStreetSegmentErrors;
