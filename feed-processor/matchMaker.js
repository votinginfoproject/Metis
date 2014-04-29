/**
 * Created by bantonides on 1/3/14.
 */
var updateCounter = 0;
var _feedId;
var _models;
var _schemaVersion;

/**
 * Creates relationships between documents in the database
 */
function onUpdate (err, numAffected) {
  updateCounter--;
  if (err) {
    console.error(err);
  }
  else {
    console.log('Updated ' + numAffected + ' document.');
  }

  if (updateCounter <= 0) {
    console.log('****Linking Complete!!!');
    console.log('****Initializing Rules Engine');
    var promise = require('./rule/rulesEngine').processRules(_feedId);


    promise.then(function(emptyPromise){
      console.log("****Processing Overview Details");
      require('./overview/overview-processor').runOverviewProcessor(_feedId)});
  }
};

function onError (err) {
  console.error(err);
};

function updateRelationship (model, conditions, update, options, callback) {
  updateCounter++;
  model.update(conditions, update, options, callback);
};

function createRelationshipsFeed (feedId, models) {
  var sourcePromise = models.Source.findOne({ _feed: feedId }).exec();
  var sourceId;

  sourcePromise.then(function (source) {
    return models.ElectionOfficial.findOne({ _feed: feedId, elementId: source.feedContactId }).select('_id').exec();
  }, onError).then(function (eoId) {
      updateRelationship(models.Feed, { _id: feedId }, { _feedContact: eoId }, onUpdate);
    }, onError);
};

function createRelationshipsSource (feedId, models) {
  var sourcePromise = models.Source.findOne({ _feed: feedId }).exec();
  var sourceId;

  sourcePromise.then(function (source) {
    sourceId = source._id;
    return models.ElectionOfficial.findOne({ _feed: feedId, elementId: source.feedContactId }).select('_id').exec();
  }, onError).then(function (eoId) {
      updateRelationship(models.Source, { _id: sourceId }, { _feedContact: eoId }, onUpdate);
    }, onError);
};

function createRelationshipsState (feedId, models) {
  var statePromise = models.State.findOne({ _feed: feedId }).exec();
  var stateId;

  statePromise.then(function (state) {
    stateId = state._id;
    updateRelationship(models.Election, { _feed: feedId }, { _state: stateId }, onUpdate);
    updateRelationship(models.Feed, { _id: feedId }, { _state: stateId }, onUpdate);

    return models.ElectionAdmin.findOne({ _feed: feedId, elementId: state.electionAdministrationId})
      .select('_id').exec();
  }, onError).then(function(eaId) {
      updateRelationship(models.State, { _id: stateId }, { _electionAdministration: eaId}, onUpdate);
    }, onError);

  var localityPromise = models.Locality.aggregate(
    { $match: { _feed: feedId } },
    { $group: {
      _id: "$stateId",
      localityIds: { $addToSet: '$_id' }
    } }).exec();

  localityPromise.then(function (localities) {
    localities.forEach(function (locality) {
      updateRelationship(models.State, { _feed: feedId, elementId: locality._id },
        { $addToSet: { _localities: { $each: locality.localityIds } } }, onUpdate);
    });
  }, onError);
};

function createRelationshipsElection (feedId, models) {
  var electionPromise = models.Election.findOne({ _feed: feedId }).select('_id').exec();

  electionPromise.then(function (electionId) {
    updateRelationship(models.Feed, { _id: feedId }, { _election: electionId}, onUpdate);
  }, onError);
};

function createRelationshipsLocality (feedId, models) {
  var promise = models.Locality.find({ _feed: feedId }).exec();

  promise.then(function (localities) {
    localities.forEach(function (locality) {
      //link to election administration and early vote sites and precincts
      if (locality.electionAdminId) {
        joinLocalityElectionAdmin(models, locality, locality.electionAdminId);
      }
      if (locality.earlyVoteSiteIds) {
        joinLocalityEarlyVoteSite(models, locality, locality.earlyVoteSiteIds);
      }
      joinLocalityPrecincts(models, locality);
    });
  }, onError);
};

function createRelationshipsPrecinct (feedId, models) {
  var promise = models.Precinct.find({ _feed: feedId }).exec();

  promise.then(function (precincts) {
    precincts.forEach(function (precinct) {
      //link to electoral district, polling location, early vote site
      if (precinct.electoralDistrictIds) {
        joinPrecinctElectoralDistricts(models, precinct);
      }
      if (precinct.earlyVoteSiteIds.length > 0) {
        joinPrecinctEarlyVoteSites(models, precinct);
      }
      if (precinct.pollingLocationIds.length > 0) {
        joinPrecinctPollingLocations(models, precinct);
      }
      joinPrecinctPrecinctSplits(models, precinct);
      joinPrecinctStreetSegments(models, precinct);
    });
  }, onError);
};

function createRelationshipsPrecinctSplit (feedId, models) {
  var promise = models.PrecinctSplit.find({ _feed: feedId }).exec();

  promise.then(function (precinctSplits) {
    precinctSplits.forEach(function (precinctSplit) {
      if (precinctSplit.electoralDistrictIds.length > 0) {
        joinPrecinctSplitElectoralDistrict(models, precinctSplit);
      }
      if (precinctSplit.pollingLocationIds.length > 0) {
        joinPrecinctSplitPollingLocations(models, precinctSplit);
      }
      joinPrecinctSplitStreetSegments(models, precinctSplit);
    });
  });
};

function createRelationshipsElectionAdministration (feedId, models) {
  var promise = models.ElectionAdmin.find({ _feed: feedId }).exec();

  promise.then(function (electionAdmins) {
    electionAdmins.forEach(function (electionAdmin) {
      if (electionAdmin.eoId) {
        joinElectionAdminElectionOfficial(models, electionAdmin);
      }
      if (electionAdmin.ovcId) {
        joinElectionAdminElectionOfficial(models, electionAdmin);
      }
    });
  });
};

function createRelationshipsContest (feedId, models) {
  var promise = models.Contest.find({ _feed: feedId }).exec();

  promise.then(function (contests) {
    contests.forEach(function (contest) {
      if (contest.electoralDistrictId) {
        joinContestElectoralDistrict(models, contest);
      }

      if (contest.ballotId) {
        joinContestBallot(models, contest);
      }

      joinContestResults(models, contest);
    });
  });
};

function createRelationshipsElectoralDistrict(feedId, models) {
  var promise = models.ElectoralDistrict.find({ _feed: feedId }).exec();

  promise.then(function (electoralDistricts) {
    electoralDistricts.forEach(function(district) {
      joinElectoralDistrictPrecincts(models, district);
    });
  });
};

function createRelationshipsBallot(feedId, models) {
  var promise = models.Ballot.find({ _feed: feedId }).exec();

  promise.then(function(ballots) {
    ballots.forEach(function(ballot) {
      if (ballot.candidates && ballot.candidates.length > 0) {
        joinBallotCandidates(models, ballot);
      }
      if (ballot.referendumIds && ballot.referendumIds.length > 0) {
        joinBallotReferenda(models, ballot);
      }
      if (ballot.customBallotId) {
        joinBallotCustomBallot(models, ballot);
      }
      if (ballot.contestIds && ballot.contestIds.length > 0) {
        joinBallotContest(models, ballot);
      }
    });
  });
};

function createRelationshipsCustomBallot(feedId, models) {
  var promise = models.CustomBallot.find({ _feed: feedId }).exec();

  promise.then(function(cbs) {
    if (cbs.length > 0) {
      cbs.forEach(function(cb) {
        joinCustomBallotResponses(models, cb);
      });
    }
  });
};

function createRelationshipsReferendum(feedId, models) {
  var promise = models.Referendum.find({ _feed: feedId }).exec();

  promise.then(function(referenda) {
    if (referenda.length > 0) {
      referenda.forEach(function(referendum) {
        joinReferendumBallotResponses(models, referendum);
      });
    }
  });
};

function createRelationshipsContestResult(feedId, models) {
  var promise = models.ContestResult.find({ _feed: feedId }).exec();

  promise.then(function(results) {
    if (results.length > 0) {
      results.forEach(function(result) {
        joinContestResultContest(models, result);
        joinContestResultJurisdiction(models, result);
      });
    }
  });
};

function createRelationshipsBallotLineResult(feedId, models) {
  var promise = models.BallotLineResult.find({ _feed: feedId }).exec();

  promise.then(function(results) {
    if (results.length > 0) {
      results.forEach(function(result) {
        joinBallotLineResultContest(models, result);
        joinBallotLineResultCandidate(models, result);
        joinBallotLineResultResponse(models, result);
        joinBallotLineResultJurisdiction(models, result);
      });
    }
  });
}

function createRelationshipsPollingLocation(feedId, models) {
  var promise = models.PollingLocation.find({ _feed: feedId }).exec();

  promise.then(function(pollingLocations) {
    if (pollingLocations.length > 0) {
      pollingLocations.forEach(function(pollingLocation) {
        joinPollingLocationPrecinct(models, pollingLocation);
        joinPollingLocationPrecinctSplit(models, pollingLocation);
      });
    }
  });
}

function createRelationshipsCandidate(feedId, models) {
  var promise = models.Candidate.find({_feed: feedId}).exec();

  promise.then(function(candidates) {
    candidates.forEach(function(candidate) {
      joinCandidateParty(models, candidate);
    })
  });
}

function joinLocalityElectionAdmin (models, locality, eaId) {
  var promise = models.ElectionAdmin.findOne({ _feed: locality._feed, elementId: eaId }).select('_id').exec();

  promise.then(function (electionAdminOid) {
    updateRelationship(models.Locality, { _id: locality._id }, { _electionAdministration: electionAdminOid }, onUpdate);
  }, onError);
};

function joinLocalityEarlyVoteSite (models, locality, evsIds) {
  var promise = models.EarlyVoteSite.find({ _feed: locality._feed, elementId: { $in: evsIds } }).select('_id').exec();

  promise.then(function (evsOids) {
    if (evsOids.length > 0) {
      updateRelationship(models.Locality, { _id: locality._id }, { $addToSet: { _earlyVoteSites: { $each: evsOids } } }, onUpdate);
      updateRelationship(models.EarlyVoteSite, { _id: { $in: evsOids } }, { _locality: locality._id }, { multi: true }, onUpdate);
    }
  }, onError);
};

function joinLocalityPrecincts (models, locality) {

  if(_schemaVersion == '5.0')
    return;

  var promise = models.Precinct.find({ _feed: locality._feed, localityId: locality.elementId }).select('_id').exec();

  promise.then(function (precinctOids) {
    if (precinctOids.length > 0) {
      updateRelationship(models.Locality, { _id: locality._id }, { $addToSet: { _precincts: { $each: precinctOids } } }, onUpdate);
    }
  }, onError);
};

function joinPrecinctElectoralDistricts (models, precinct) {
  var promise = models.ElectoralDistrict
    .find({ _feed: precinct._feed, elementId: { $in: precinct.electoralDistrictIds } })
    .select('_id')
    .exec();

  promise.then(function (edOids) {
    if (edOids.length > 0) {
      updateRelationship(models.Precinct, { _id: precinct._id }, { $addToSet: { _electoralDistricts: { $each: edOids } } }, onUpdate);
    }
  }, onError);
};

function joinPrecinctEarlyVoteSites (models, precinct) {
  var promise = models.EarlyVoteSite
    .find({ _feed: precinct._feed, elementId: { $in: precinct.earlyVoteSiteIds } })
    .select('_id')
    .exec();

  promise.then(function (evsOids) {
    if (evsOids.length > 0) {
      updateRelationship(models.Precinct, { _id: precinct._id }, { $addToSet: { _earlyVoteSites: { $each: evsOids } } }, onUpdate);
    }
  }, onError);
};

function joinPrecinctPollingLocations (models, precinct) {

  if(_schemaVersion == '5.0')
    return;

  var promise = models.PollingLocation
    .find({ _feed: precinct._feed, elementId: { $in: precinct.pollingLocationIds } })
    .select('_id')
    .exec();

  promise.then(function (plOids) {
    if (plOids.length > 0) {
      updateRelationship(models.Precinct, { _id: precinct._id }, { $addToSet: { _pollingLocations: { $each: plOids } } }, onUpdate);
    }
  }, onError);
};

function joinPrecinctPrecinctSplits (models, precinct) {
  var promise = models.PrecinctSplit
    .find({ _feed: precinct._feed, precinctId: precinct.elementId })
    .select('_id')
    .exec();

  promise.then(function (psOids) {
    if (psOids.length > 0) {
      if(_schemaVersion == '3.0') {
        updateRelationship(models.Precinct, { _id: precinct._id }, { $addToSet: { _precinctSplits: { $each: psOids } } }, onUpdate);
      }

      var psIds = psOids.map(function(ps) { return ps._id; });
      updateRelationship(models.PrecinctSplit, { _id: { $in: psIds } }, { _precinct: precinct }, { multi: true }, onUpdate);
    }
  });
};

function joinPrecinctStreetSegments (models, precinct) {
  var promise = models.StreetSegment.find({ _feed: precinct._feed, precinctId: precinct.elementId })
    .select('_id')
    .exec();

  promise.then(function (streetOids) {
    if (streetOids.length > 0) {
      updateRelationship(models.Precinct, { _id: precinct._id }, { $addToSet: { _streetSegments: { $each: streetOids } } }, onUpdate);
    }
  });
};

function joinPrecinctSplitElectoralDistrict (models, precinctSplit) {
  var promise = models.ElectoralDistrict
    .find({ _feed: precinctSplit._feed, elementId: { $in: precinctSplit.electoralDistrictIds } })
    .select('_id')
    .exec();

  promise.then(function (edOids) {
    if (edOids.length > 0) {
      updateRelationship(models.PrecinctSplit,
        { _id: precinctSplit._id },
        { $addToSet: { _electoralDistricts: { $each: edOids } } },
        onUpdate);
    }
  });
};

function joinPrecinctSplitStreetSegments (models, precinctSplit) {
  var promise = models.StreetSegment.find({ _feed: precinctSplit._feed, precinctSplitId: precinctSplit.elementId })
    .select('_id')
    .exec();

  promise.then(function (streetOids) {
    if (streetOids.length > 0) {
      updateRelationship(models.PrecinctSplit,
        { _id: precinctSplit._id },
        { $addToSet: { _streetSegments: { $each: streetOids } } },
        onUpdate);
    }
  });
};

function joinPrecinctSplitPollingLocations (models, precinctSplit) {
  var promise = models.PollingLocation
    .find({ _feed: precinctSplit._feed, elementId: { $in: precinctSplit.pollingLocationIds } })
    .select('_id')
    .exec();

  promise.then(function (plOids) {
    if (plOids.length > 0) {
      updateRelationship(models.PrecinctSplit,
        { _id: precinctSplit._id },
        { $addToSet: { _pollingLocations: { $each: plOids } } },
        onUpdate);
    }
  });
};

function joinElectionAdminElectionOfficial (models, electionAdmin) {
  var promiseEO = models.ElectionOfficial.findOne({ _feed: electionAdmin._feed, elementId: electionAdmin.eoId })
    .select('_id')
    .exec();

  var promiseOVC = models.ElectionOfficial.findOne({ _feed: electionAdmin._feed, elementId: electionAdmin.ovcId })
    .select('_id')
    .exec();

  promiseEO.then(function (eo) {
    if (eo) {
      updateRelationship(models.ElectionAdmin, { _id: electionAdmin._id }, { _electionOfficial: eo._id }, onUpdate);
    }
  });

  promiseOVC.then(function (ovc) {
    if (ovc) {
      updateRelationship(models.ElectionAdmin, { _id: electionAdmin._id }, { _overseasVoterContact: ovc._id }, onUpdate);
    }
  });
};

function joinContestElectoralDistrict (models, contest) {
  var promise = models.ElectoralDistrict.findOne({ _feed: contest._feed, elementId: contest.electoralDistrictId })
    .select('_id')
    .exec();

  promise.then(function (ed) {
    if (ed) {
      updateRelationship(models.Contest, { _id: contest._id }, { _electoralDistrict: ed._id }, onUpdate);
      updateRelationship(models.ElectoralDistrict, { _id: ed._id }, { _contest: contest }, onUpdate);
    }
  });
};

function joinContestBallot (models, contest) {
  var promise = models.Ballot.findOne({ _feed: contest._feed, elementId: contest.ballotId })
    .select('_id')
    .exec();

  promise.then(function (ballot) {
    if (ballot) {
      updateRelationship(models.Contest, { _id: contest._id }, { _ballot: ballot._id }, onUpdate);
    }
  });
};

function joinContestResults (models, contest) {
  var promiseCR = models.ContestResult.findOne({ _feed: contest._feed, contestId: contest.elementId })
    .select('_id')
    .exec();

  promiseCR.then(function(contestResult) {
    if (contestResult) {
      updateRelationship(models.Contest, { _id: contest._id }, { _contestResult: contestResult._id }, onUpdate);
    }
  });

  var promiseBLR = models.BallotLineResult.find({ _feed: contest._feed, contestId: contest.elementId })
    .select('_id')
    .exec();

  promiseBLR.then(function(blrOids) {
    if (blrOids.length > 0) {
      updateRelationship(models.Contest,
        { _id: contest._id },
        { $addToSet: { _ballotLineResults: { $each: blrOids } } },
        onUpdate);
    }
  });
};

function joinElectoralDistrictPrecincts(models, electoralDistrict) {
  var promisePrecincts = models.Precinct
    .find({ _feed: electoralDistrict._feed, electoralDistrictIds: electoralDistrict.elementId })
    .select('_id')
    .exec();

  promisePrecincts.then(function(precincts) {
    if (precincts.length > 0) {
      updateRelationship(models.ElectoralDistrict,
        { _id: electoralDistrict._id },
        { $addToSet: { _precincts: { $each: precincts } } },
        onUpdate);
    }
  });

  var promisePrecinctSplits = models.PrecinctSplit
    .find({ _feed: electoralDistrict._feed, electoralDistrictIds: electoralDistrict.elementId })
    .select('_id')
    .exec();

  promisePrecinctSplits.then(function(precinctSplits) {
    if (precinctSplits.length > 0) {
      updateRelationship(models.ElectoralDistrict,
        { _id: electoralDistrict._id },
        { $addToSet: { _precinctSplits: { $each: precinctSplits } } },
        onUpdate);
    }
  });
};

function joinBallotCandidates(models, ballot) {
  var candidateIds = ballot.candidates.map(function(candidate) { return candidate.elementId });
  var promise = models.Candidate.find({ _feed: ballot._feed, elementId: { $in: candidateIds } })
    .select('_id elementId')
    .exec();

  promise.then(function (candidates) {
    candidates.forEach(function(candidate) {
      updateRelationship(models.Ballot,
        {_id: ballot._id, 'candidates.elementId': candidate.elementId },
        {$set: { 'candidates.$._candidate': candidate._id } },
        onUpdate);
    });
  });
};

function joinBallotReferenda(models, ballot) {

  var referendumIds = ballot.referendumIds.map(function(referenda) { return referenda.elementId });
  var promise = models.Referendum.find({ _feed: ballot._feed, elementId: { $in: referendumIds } })
    .select('_id elementId')
    .exec();

  promise.then(function(referenda) {

    // TODO - needs fix
    if (referenda.length > 0) {
      updateRelationship(models.Ballot,
        { _id: ballot._id },
        { $addToSet: { _referenda: { $each: referenda } } },
        onUpdate);
    }

    /*
    if (referenda.length > 0) {
      referenda.forEach(function(referendum) {
        updateRelationship(models.Ballot,
          { _id: ballot._id },
          { $set: { '_referenda.$._id': referendum._id } },
          onUpdate);
      });
    }
    */

  });
};

function joinBallotCustomBallot(models, ballot) {
  var promise = models.CustomBallot.findOne({ _feed: ballot._feed, elementId: ballot.customBallotId })
    .select('_id')
    .exec();

  promise.then(function(customBallot) {
    updateRelationship(models.Ballot, { _id: ballot._id }, { $set: { _customBallot: customBallot } },
    onUpdate);
  });
};

function joinCustomBallotResponses(models, customBallot) {
  var ballotResponseIds = customBallot.ballotResponses.map(function(resp) { return resp.elementId; });
  var promise = models.BallotResponse.find({ _feed: customBallot._feed, elementId: { $in: ballotResponseIds } })
    .select('_id elementId')
    .exec();

  promise.then(function(responses) {
    responses.forEach(function(resp) {
      updateRelationship(models.CustomBallot,
        {_id: customBallot._id, 'ballotResponses.elementId': resp.elementId },
        {$set: { 'ballotResponses.$._response': resp._id } },
        onUpdate);
    });
  });
};

function joinReferendumBallotResponses(models, referendum) {
  var ballotResponseIds = referendum.ballotResponses.map(function(resp) {
    return resp.elementId;
  });
  var promise = models.BallotResponse.find({ _feed: referendum._feed, elementId: { $in: ballotResponseIds } })
    .select('_id elementId')
    .exec();

  promise.then(function(responses) {
    responses.forEach(function(resp) {
      updateRelationship(models.Referendum,
        {_id: referendum._id, 'ballotResponses.elementId': resp.elementId },
        {$set: { 'ballotResponses.$._response': resp._id } },
        onUpdate);
    });
  });
};

function joinContestResultContest(models, result) {
  var promise = models.Contest.findOne({ _feed: result._feed, elementId: result.contestId })
    .select('_id')
    .exec();

  promise.then(function(contest) {
    updateRelationship(models.ContestResult, { _id: result._id }, { _contest: contest }, onUpdate);
  });
};

function joinContestResultJurisdiction(models, result) {
  var promiseState = models.State.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseLocality = models.Locality.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinct = models.Precinct.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinctSplit = models.PrecinctSplit.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseElectoralDistrict = models.ElectoralDistrict.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  promiseState.then(function(state) {
    if (state) {
      updateRelationship(models.ContestResult, { _id: result._id }, { _state: state }, onUpdate);
    }
  });

  promiseLocality.then(function(locality) {
    if (locality) {
      updateRelationship(models.ContestResult, { _id: result._id }, { _locality: locality }, onUpdate);
    }
  });

  promisePrecinct.then(function(precinct) {
    if (precinct) {
      updateRelationship(models.ContestResult, { _id: result._id }, { _precinct: precinct }, onUpdate);
    }
  });

  promisePrecinctSplit.then(function(precinctSplit) {
    if (precinctSplit) {
      updateRelationship(models.ContestResult, { _id: result._id }, { _precinctSplit: precinctSplit }, onUpdate);
    }
  });

  promiseElectoralDistrict.then(function(district) {
    if (district) {
      updateRelationship(models.ContestResult, { _id: result._id }, { _electoralDistrict: district }, onUpdate);
    }
  });
}

function joinBallotLineResultContest(models, result) {
  var promise = models.Contest.findOne({ _feed: result._feed, elementId: result.contestId })
    .select('_id')
    .exec();

  promise.then(function(contest) {
    updateRelationship(models.BallotLineResult, { _id: result._id }, { _contest: contest }, onUpdate);
  });
}

function joinBallotLineResultCandidate(models, result) {
  if (result.candidateId) {
    var promise = models.Candidate.findOne({ _feed: result._feed, elementId: result.candidateId })
      .select('_id')
      .exec();

    promise.then(function(candidate) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _candidate: candidate }, onUpdate);
    });
  }
}

function joinBallotLineResultResponse(models, result) {
  if (result.ballotResponseId) {
    var promise = models.BallotResponse.findOne({ _feed: result._feed, elementId: result.ballotResponseId })
      .select('_id')
      .exec();

    promise.then(function(response) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _ballotResponse: response }, onUpdate);
    });
  }
}


function joinBallotLineResultJurisdiction(models, result) {
  var promiseState = models.State.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseLocality = models.Locality.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinct = models.Precinct.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinctSplit = models.PrecinctSplit.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseElectoralDistrict = models.ElectoralDistrict.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  promiseState.then(function(state) {
    if (state) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _state: state }, onUpdate);
    }
  });

  promiseLocality.then(function(locality) {
    if (locality) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _locality: locality }, onUpdate);
    }
  });

  promisePrecinct.then(function(precinct) {
    if (precinct) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _precinct: precinct }, onUpdate);
    }
  });

  promisePrecinctSplit.then(function(precinctSplit) {
    if (precinctSplit) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _precinctSplit: precinctSplit }, onUpdate);
    }
  });

  promiseElectoralDistrict.then(function(district) {
    if (district) {
      updateRelationship(models.BallotLineResult, { _id: result._id }, { _electoralDistrict: district }, onUpdate);
    }
  });
}

function joinPollingLocationPrecinct(models, pollingLocation) {
  var promise = models.Precinct.find({ _feed: pollingLocation._feed, pollingLocationIds: pollingLocation.elementId })
    .select('_id')
    .exec();

  promise.then(function(precincts) {
    updateRelationship(models.PollingLocation,
      { _id: pollingLocation._id },
      { $addToSet: { _precincts: { $each: precincts } } },
      onUpdate);
  });
}

function joinPollingLocationPrecinctSplit(models, pollingLocation) {
  var promise = models.PrecinctSplit.find({ _feed: pollingLocation._feed, pollingLocationIds: pollingLocation.elementId })
    .select('_id')
    .exec();

  promise.then(function(precinctSplits) {
    updateRelationship(models.PollingLocation,
      { _id: pollingLocation._id },
      { $addToSet: { _precinctSplits: { $each: precinctSplits } } },
      onUpdate);
  });
}

function joinCandidateParty(models, candidate) {
  var promise = models.Party.findOne({_feed: candidate._feed, elementId: candidate.partyId})
    .select('_id')
    .exec();

  promise.then(function(party) {
    updateRelationship(models.Candidate,
      { _id: candidate._id },
      { _party: party._id }, onUpdate);
  });
}

function joinBallotContest(models, ballot) {

  var contestIds = ballot.contestIds.map(function(contest) { return contest.elementId });
  var promise = models.Contest.find({_feed: ballot._feed, elementId: { $in: contestIds }})
    .select('_id')
    .exec();

  promise.then(function(contests) {
    updateRelationship(models.Ballot,
      { _id: ballot._id },
      { $addToSet: { _contests: { $each: contests } }},
      onUpdate);
  });
};

function createDBRelationships(feedId, models, schemaVersion) {
  createRelationshipsFeed(feedId, models);
  createRelationshipsSource(feedId, models);
  createRelationshipsState(feedId, models);
  createRelationshipsElection(feedId, models);
  createRelationshipsLocality(feedId, models);
  createRelationshipsPrecinct(feedId, models);
  createRelationshipsPrecinctSplit(feedId, models);
  createRelationshipsElectionAdministration(feedId, models);
  createRelationshipsContest(feedId, models);
  createRelationshipsElectoralDistrict(feedId, models);
  createRelationshipsBallot(feedId, models);
  createRelationshipsCustomBallot(feedId, models);
  createRelationshipsReferendum(feedId, models);
  createRelationshipsContestResult(feedId, models);
  createRelationshipsBallotLineResult(feedId, models);
  createRelationshipsPollingLocation(feedId, models);
  createRelationshipsCandidate(feedId, models);

  _feedId = feedId;
  _models = models;
  _schemaVersion = schemaVersion;
};

exports.createDBRelationships = createDBRelationships;