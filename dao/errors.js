/**
 * Created by bantonides on 2/10/14.
 */
var daoSchemas = require('./schemas');
var when = require('when');
var _ = require('underscore');
var async = require('async');

function allErrors(feedId, callback) {
  var allErrorModels = [daoSchemas.models.ballots.Error,
    daoSchemas.models.ballotresponses.Error,
    daoSchemas.models.ballotlineresults.Error,
    daoSchemas.models.candidates.Error,
    daoSchemas.models.contests.Error,
    daoSchemas.models.contestresults.Error,
    daoSchemas.models.customballots.Error,
    daoSchemas.models.earlyvotesites.Error,
    daoSchemas.models.elections.Error,
    daoSchemas.models.electionadmins.Error,
    daoSchemas.models.electionofficials.Error,
    daoSchemas.models.electoraldistricts.Error,
    daoSchemas.models.localitys.Error,
    daoSchemas.models.pollinglocations.Error,
    daoSchemas.models.precincts.Error,
    daoSchemas.models.precinctsplits.Error,
    daoSchemas.models.referendums.Error,
    daoSchemas.models.sources.Error,
    daoSchemas.models.states.Error,
    daoSchemas.models.streetsegments.Error];

  var errorQueries = allErrorModels.map(function (model) {
    return aggregateErrors({ $match: { _feed: daoSchemas.types.ObjectId(feedId) } }, model).exec();
  });

  when.all(errorQueries).then(function (errors) {
    var index = 0;
    async.forEach(errors, function(error, done) {
      findTextualReference(allErrorModels[index++], feedId, error, null, function() {
        done();
      });
    }, function(err) { callback(null, groupErrors(errors)) })

  }, callback);
}

function ballotErrors(feedId, contestId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: contestId };
  var model = daoSchemas.models.ballots.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, contestId, callback);
    });
}

function ballotLineResultErrors(feedId, ballotLineResultId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: ballotLineResultId };
  var model = daoSchemas.models.ballotlineresults.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, ballotLineResultId, callback);
    });
}

function candidateErrors(feedId, candidateId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: candidateId };
  var model = daoSchemas.models.candidates.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, candidateId, callback);
    });
}

function contestErrors(feedId, contestId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: contestId };
  var model = daoSchemas.models.contests.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, contestId, callback);
    });
}

function contestResultErrors(feedId, contestId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: contestId };
  var model = daoSchemas.models.contestresults.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, contestId, callback);
    });
}

function customBallotErrors(feedId, customBallotId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: customBallotId };
  var model = daoSchemas.models.customballots.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, customBallotId, callback);
    });
}

function earlyVoteSiteErrors(feedId, earlyVoteSiteId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: earlyVoteSiteId };
  var model = daoSchemas.models.earlyvotesites.Error;
  aggregateErrors({ $match:  matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, earlyVoteSiteId, callback);
    });
}

function electionErrors(feedId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId) }
  var model = daoSchemas.models.elections.Error;
  aggregateErrors({ $match: matcher }, model)
    .exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, null, callback);
    });
}

function electionAdminErrors(feedId, electionAdminId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: electionAdminId };
  var model = daoSchemas.models.electionadmins.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, electionAdminId, callback);
    });
}

function electionOfficialErrors(feedId, electionOfficialId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: electionOfficialId };
  var model = daoSchemas.models.electionofficials.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, electionOfficialId, callback);
    });
}

function electoralDistrictErrors(feedId, electoralDistrictId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: electoralDistrictId };
  var model = daoSchemas.models.electoraldistricts.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, electoralDistrictId, callback);
    });
}

function localityErrors(feedId, localityId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: localityId };
  var model = daoSchemas.models.localitys.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, localityId, callback);
    });
}

function pollingLocationErrors(feedId, pollingLocationId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: pollingLocationId };
  var model = daoSchemas.models.pollinglocations.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, pollingLocationId, callback);
    });
}

function precinctErrors(feedId, precinctId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: precinctId };
  var model = daoSchemas.models.precincts.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, precinctId, callback);
    });
}

function precinctSplitErrors(feedId, precinctSplitId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: precinctSplitId };
  var model = daoSchemas.models.precinctsplits.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, precinctSplitId, callback);
    });
}

function referendumErrors(feedId, referendumId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: referendumId };
  var model = daoSchemas.models.referendums.Error;
  aggregateErrors({ $match: matcher }, model).exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, referendumId, callback);
    });
}

function sourceErrors(feedId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId) };
  var model = daoSchemas.models.sources.Error;
  aggregateErrors({ $match: matcher }, model)
    .exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, null, callback);
    });
}

function stateErrors(feedId, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId) };
  var model = daoSchemas.models.states.Error;
  aggregateErrors({ $match: matcher }, model)
    .exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, null, callback);
    });
}

function ballotResponseErrors(feedId, responseIds, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId), refElementId: { $in: responseIds } };
  var model = daoSchemas.models.ballotresponses.Error;
  aggregateErrors({ $match: matcher }, model)
    .exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, responseIds, callback);
    });
}

function precinctStreetSegmentErrors(feedId, precinctId, callback) {
  var promise = daoSchemas.models.precincts
    .findOne({ _feed: feedId, elementId: precinctId })
    .select('_streetSegments')
    .exec();

  promise.then(function (precinct) {
    var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: { $in: precinct._streetSegments } };
    var model = daoSchemas.models.streetsegments.Error;
    aggregateErrors({ $match: matcher }, model)
      .exec(function(err, aggregate) {
        findTextualReference(model, feedId, aggregate, precinct._streetSegments, callback);
      });
  });
}

function precinctSplitStreetSegmentErrors(feedId, precinctSplitId, callback) {
  var promise = daoSchemas.models.precinctsplits
    .findOne({ _feed: feedId, elementId: precinctSplitId })
    .select('_streetSegments')
    .exec();

  promise.then(function (precinctSplit) {
    var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: { $in: precinctSplit._streetSegments } };
    var model = daoSchemas.models.streetsegments.Error;
    aggregateErrors({ $match: matcher }, model)
      .exec(function(err, aggregate) {
        findTextualReference(model, feedId, aggregate, precinctSplit._streetSegments, callback);
      });
  });
}


function errorIndex(feedId, model, callback) {
  var matcher = { _feed: daoSchemas.types.ObjectId(feedId) };
  aggregateErrors({ $match: matcher }, model)
    .exec(function(err, aggregate) {
      findTextualReference(model, feedId, aggregate, null, callback);
    });
}

// All Early Vote Site errors under a specific Locality
function errorIndexLocalityEarlyVoteSite(feedId, localityId, callback) {
  var localityPromise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId }, {_earlyVoteSites: 1}).exec();

  localityPromise.then(function (locality) {
    var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: {$in: locality._earlyVoteSites} };
    var model = daoSchemas.models.earlyvotesites.Error;
    aggregateErrors({ $match: matcher }, model)
      .exec(function(err, aggregate) {
        findTextualReference(model, feedId, aggregate, locality._earlyVoteSites, callback);
      });
  });
}

// All Election Administration errors under a specific Locality
function errorIndexLocalityElectionAdministration(feedId, localityId, callback) {
  var localityPromise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId }, {_electionAdministration: 1}).exec();

  localityPromise.then(function (locality) {
    var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: locality._electionAdministration };
    var model = daoSchemas.models.electionadmins.Error;
    aggregateErrors({ $match: matcher }, model)
      .exec(function(err, aggregate) {
        findTextualReference(model, feedId, aggregate, [locality._electionAdministration], callback);
      });
  });
}

// All Polling Locations errors under a specific Locality
function errorIndexLocalityPollingLocations(feedId, localityId, callback) {
  var localityPromise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId }, {_precincts: 1}).exec();

  localityPromise.then(function (locality) {

    var precinctsPromise = daoSchemas.models.precincts.find({ _feed: feedId, _id: {$in: locality._precincts} }, {_pollingLocations: 1}).exec();

    precinctsPromise.then(function (precincts) {

      var pollinglocations = [];
      precincts.forEach( function(precinct){
        precinct._pollingLocations.forEach( function(pollinglocation){
          pollinglocations.push(pollinglocation);
        });
      });

      var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: {$in: pollinglocations} };
      var model = daoSchemas.models.pollinglocations.Error;
      aggregateErrors({ $match: matcher }, model)
        .exec(function(err, aggregate) {
          findTextualReference(model, feedId, aggregate, pollinglocations, callback);
        });
    });
  });
}

// All Precinct Split errors under a specific Locality
function errorIndexLocalityPrecinctSplits(feedId, localityId, callback) {
  var localityPromise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId }, {_precincts: 1}).exec();

  localityPromise.then(function (locality) {

    var precinctsPromise = daoSchemas.models.precincts.find({ _feed: feedId, _id: {$in: locality._precincts} }, {_precinctSplits: 1}).exec();

    precinctsPromise.then(function (precincts) {

      var precinctsplits = [];
      precincts.forEach( function(precinct){
        precinct._precinctSplits.forEach( function(precinctsplit){
          precinctsplits.push(precinctsplit);
        });
      });

      var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: {$in: precinctsplits} };
      var model = daoSchemas.models.precinctsplits.Error;
      aggregateErrors({ $match: matcher }, model)
        .exec(function(err, aggregate) {
          findTextualReference(model, feedId, aggregate, precinctsplits, callback);
        });
    });
  });
}

// All Precinct errors under a specific Locality
function errorIndexLocalityPrecincts(feedId, localityId, callback) {
  var localityPromise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId }, {_precincts: 1}).exec();

  localityPromise.then(function (locality) {
    var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: {$in: locality._precincts} };
    var model = daoSchemas.models.precincts.Error;
    aggregateErrors({ $match: matcher }, model)
      .exec(function(err, aggregate) {
        findTextualReference(model, feedId, aggregate, locality._precincts, callback);
      });
  });
}

// All Street Segment errors under a specific Locality
function errorIndexLocalityStreetSegments(feedId, localityId, callback) {
  var localityPromise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId }, {_precincts: 1}).exec();
  var streetsegments = [];

  localityPromise.then(function (locality) {

    var precinctsPromise = daoSchemas.models.precincts.find({ _feed: feedId, _id: {$in: locality._precincts} }, {_precinctSplits: 1, _streetSegments: 1}).exec();

    precinctsPromise.then(function (precincts) {

      var precinctsplits = [];
      precincts.forEach( function(precinct){
        // capture the precinct splits
        precinct._precinctSplits.forEach( function(precinctsplit){
          precinctsplits.push(precinctsplit);
        });

        // capture the street segments on the Precincts level
        precinct._streetSegments.forEach( function(streetsegment){
          streetsegments.push(streetsegment);
        });

      });

      var precinctsplitsPromise = daoSchemas.models.precinctsplits.find({ _feed: feedId, _id: {$in: precinctsplits} }, {_streetSegments: 1}).exec();

      precinctsplitsPromise.then(function (precinctsplits) {

        precinctsplits.forEach( function(precinctsplit){
          // capture the street segments on the Precinct Splits level
          precinctsplit._streetSegments.forEach( function(streetsegment){
            streetsegments.push(streetsegment);
          });

        });

        var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: {$in: streetsegments} };
        var model = daoSchemas.models.streetsegments.Error;
        aggregateErrors({ $match: matcher }, model)
          .exec(function(err, aggregate) {
            findTextualReference(model, feedId, aggregate, streetsegments, callback);
          });

      });

    });
  });
}

// All Ballot errors under a specific Contest
function errorIndexContestBallot(feedId, contestId, callback) {

  var contestPromise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId }, {_ballot: 1}).exec();

  contestPromise.then(function (contest) {

    var ballotPromise = daoSchemas.models.ballots.findOne({ _id: contest._ballot }, {_id: 1}).exec();

    ballotPromise.then(function (ballot) {
      var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: ballot._id };
      var model = daoSchemas.models.ballots.Error;
      aggregateErrors({ $match: matcher }, model)
        .exec(function(err, aggregate) {
          findTextualReference(model, feedId, aggregate, [ballot._id], callback);
        });
    });
  });
}

// All Candidates errors under a specific Contest
function errorIndexContestCandidates(feedId, contestId, callback) {

    var contestPromise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId }, {_ballot: 1}).exec();

    contestPromise.then(function (contest) {

      var ballotPromise = daoSchemas.models.ballots.findOne({ _id: contest._ballot }, {candidates: 1}).exec();

      ballotPromise.then(function (ballot) {
        var candidates = [];
        ballot.candidates.forEach( function(candidate){
          candidates.push(candidate._candidate);
        });

        var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: { $in: candidates } };
        var model = daoSchemas.models.candidates.Error;
        aggregateErrors({ $match: matcher }, model)
          .exec(function(err, aggregate) {
             findTextualReference(model, feedId, aggregate, candidates, callback);
          });
      });
    });
}

// All Electoral District errors under a specific Contest
function errorIndexContestElectoralDistrict(feedId, contestId, callback) {

  var contestPromise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId }, {_electoralDistrict: 1}).exec();

  contestPromise.then(function (contest) {
    var electoraldistrictPromise = daoSchemas.models.electoraldistricts.findOne({ _id: contest._electoralDistrict }, {_id: 1}).exec();

    electoraldistrictPromise.then(function (electoraldistrict) {
      var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: electoraldistrict._id };
      var model = daoSchemas.models.electoraldistricts.Error;
      aggregateErrors({ $match: matcher }, model)
        .exec(function(err, aggregate) {
          findTextualReference(model, feedId, aggregate, [electoraldistrict._id], callback);
        });
    });
  });
}

// All Referenda errors under a specific Contest
function errorIndexContestReferenda(feedId, contestId, callback) {

  var contestPromise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId }, {_ballot: 1}).exec();

  contestPromise.then(function (contest) {
    var ballotPromise = daoSchemas.models.ballots.findOne({ _id: contest._ballot }, {_referenda: 1}).exec();

    ballotPromise.then(function (ballot) {
      var matcher = { _feed: daoSchemas.types.ObjectId(feedId), _ref: {$in: ballot._referenda } };
      var model = daoSchemas.models.referendums.Error;
      aggregateErrors({ $match: matcher }, model)
        .exec(function(err, aggregate) {
          findTextualReference(model, feedId, aggregate, ballot._referenda, callback);
        });
    });
  });
}

function aggregateErrors(match, errorModel) {
  return errorModel.aggregate(
    match,
    {
      $group: {
        _id: {
          errorCode: "$errorCode"
        },
        count: { $sum: 1 }
      }
    });
}

function findTextualReference(model, feedId, aggregates, ids, callback) {
  async.forEach(aggregates, function(agg, done) {
    var search = null;

    if(ids) {
      if(typeof ids !== 'string')
        search = { _feed: feedId, errorCode: agg._id.errorCode, _ref: { $in: ids }};
      else
        search = { _feed: feedId, errorCode: agg._id.errorCode, refElementId: ids };
    }
    else {
      search = { _feed: feedId, errorCode: agg._id.errorCode };
    }

    model.findOne(search, { textualReference: 1, severityCode: 1, severityText: 1, title: 1, details: 1 })
      .exec(function (err, references) {
        agg.textualReferences = [references.textualReference];
        agg.severityCode = references.severityCode;
        agg.severityText = references.severityText;
        agg.title = references.title;
        agg.details = references.details;
        agg.models = [model.modelName];
        agg.searches = [search];
        done();
      });
  }, function(err) {
    callback(null, aggregates)
  })
}

function groupErrors(errors) {
  var flat = _.flatten(errors);
  var grouped = _.groupBy(flat, function(err) { return err._id.errorCode; });
  var mapred = _.values(grouped).map(function(errs) {
    var initialState = {
      _id: _.first(errs)._id,
      severityCode : _.first(errs).severityCode,
      severityText : _.first(errs).severityText,
      title : _.first(errs).title,
      details : _.first(errs).details,
      count: 0,
      textualReferences: [],
      models: [],
      searches: []
    };
    return _.reduce(errs, function(memo, err) {
      memo.count += err.count;
      memo.textualReferences = memo.textualReferences.concat(err.textualReferences);
      memo.severityCode = err.severityCode;
      memo.severityText = err.severityText;
      memo.title = err.title;
      memo.details = err.details;
      memo.models = memo.models.concat(err.models);
      memo.searches = memo.searches.concat(err.searches);
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

// error indexes
// feed overview
exports.errorIndex = errorIndex;

// under a specific locality
exports.errorIndexLocalityEarlyVoteSite = errorIndexLocalityEarlyVoteSite;
exports.errorIndexLocalityElectionAdministration = errorIndexLocalityElectionAdministration;
exports.errorIndexLocalityPollingLocations = errorIndexLocalityPollingLocations;
exports.errorIndexLocalityPrecinctSplits = errorIndexLocalityPrecinctSplits;
exports.errorIndexLocalityPrecincts = errorIndexLocalityPrecincts;
exports.errorIndexLocalityStreetSegments = errorIndexLocalityStreetSegments;

// under a specific contest
exports.errorIndexContestBallot = errorIndexContestBallot;
exports.errorIndexContestCandidates = errorIndexContestCandidates;
exports.errorIndexContestElectoralDistrict = errorIndexContestElectoralDistrict;
exports.errorIndexContestReferenda = errorIndexContestReferenda;
