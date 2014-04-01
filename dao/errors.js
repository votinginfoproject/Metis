/**
 * Created by bantonides on 2/10/14.
 */
var daoSchemas = require('./schemas');
var when = require('when');
var _ = require('underscore');

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
    return aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId) } }, model).exec();
  });

  when.all(errorQueries).then(function (errors) {
    callback(null, groupErrors(errors));
  }, callback);
}

function ballotErrors(feedId, contestId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: contestId } }
    , daoSchemas.models.Ballot.Error).exec(callback);
}

function ballotLineResultErrors(feedId, ballotLineResultId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: ballotLineResultId } }
    , daoSchemas.models.BallotLineResult.Error).exec(callback);
}

function candidateErrors(feedId, candidateId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: candidateId } }
    , daoSchemas.models.Candidate.Error).exec(callback);
}

function contestErrors(feedId, contestId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: contestId } }
    , daoSchemas.models.Contest.Error).exec(callback);
}

function contestResultErrors(feedId, contestId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: contestId } }
    , daoSchemas.models.ContestResult.Error).exec(callback);
}

function customBallotErrors(feedId, customBallotId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: customBallotId } }
    , daoSchemas.models.CustomBallot.Error).exec(callback);
}

function earlyVoteSiteErrors(feedId, earlyVoteSiteId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: earlyVoteSiteId } }
    , daoSchemas.models.EarlyVoteSite.Error).exec(callback);
}

function electionErrors(feedId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId) } }, daoSchemas.models.Election.Error)
    .exec(callback);
}

function electionAdminErrors(feedId, electionAdminId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: electionAdminId } }
    , daoSchemas.models.ElectionAdmin.Error).exec(callback);
}

function electionOfficialErrors(feedId, electionOfficialId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: electionOfficialId } }
    , daoSchemas.models.ElectionOfficial.Error).exec(callback);
}

function electoralDistrictErrors(feedId, electoralDistrictId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: electoralDistrictId } }
    , daoSchemas.models.ElectoralDistrict.Error).exec(callback);
}

function localityErrors(feedId, localityId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: localityId } }
    , daoSchemas.models.Locality.Error).exec(callback);
}

function pollingLocationErrors(feedId, pollingLocationId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: pollingLocationId } }
    , daoSchemas.models.PollingLocation.Error).exec(callback);
}

function precinctErrors(feedId, precinctId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: precinctId } }
    , daoSchemas.models.Precinct.Error).exec(callback);
}

function precinctSplitErrors(feedId, precinctSplitId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: precinctSplitId } }
    , daoSchemas.models.PrecinctSplit.Error).exec(callback);
}

function referendumErrors(feedId, referendumId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: referendumId } }
    , daoSchemas.models.Referendum.Error).exec(callback);
}

function sourceErrors(feedId, callback) {

  console.log(feedId)
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId) } }, daoSchemas.models.Source.Error)
    .exec(callback);
}

function stateErrors(feedId, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId) } }, daoSchemas.models.State.Error)
    .exec(callback);
}

function ballotResponseErrors(feedId, responseIds, callback) {
  aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), refElementId: { $in: responseIds } } }, daoSchemas.models.BallotResponse.Error)
    .exec(callback);
}

function precinctStreetSegmentErrors(feedId, precinctId, callback) {
  var promise = daoSchemas.models.Precinct
    .findOne({ _feed: feedId, elementId: precinctId })
    .select('_streetSegments')
    .exec();

  promise.then(function (precinct) {
    aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), _ref: { $in: precinct._streetSegments } } },
      daoSchemas.models.StreetSegment.Error)
      .exec(callback);
  });
}

function precinctSplitStreetSegmentErrors(feedId, precinctSplitId, callback) {
  var promise = daoSchemas.models.PrecinctSplit
    .findOne({ _feed: feedId, elementId: precinctSplitId })
    .select('_streetSegments')
    .exec();

  promise.then(function (precinctSplit) {
    aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId), _ref: { $in: precinctSplit._streetSegments } } },
      daoSchemas.models.StreetSegment.Error)
      .exec(callback);
  });
}

function aggregateErrors(match, errorModel) {
  return errorModel.aggregate(
    match,
    {
      $group: {
        _id: {
          errorCode: "$errorCode",
          severityCode: "$severityCode",
          severityText: "$severityText",
          title: "$title",
          details: "$details"
        },
        count: { $sum: 1 },
        textualReferences: { $push: "$textualReference" }
      }
    });
}

function groupErrors(errors) {
  var flat = _.flatten(errors);
  var grouped = _.groupBy(flat, function(err) { return err._id.errorCode; });
  var mapred = _.values(grouped).map(function(errs) {
    var initialState = {
      _id: _.first(errs)._id,
      count: 0,
      textualReferences: []
    };
    return _.reduce(errs, function(memo, err) {
      memo.count += err.count;
      memo.textualReferences = memo.textualReferences.concat(err.textualReferences);
      return memo;
    }, initialState)
  });
  return mapred;
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
exports.ballotResponseErrors = ballotResponseErrors;
