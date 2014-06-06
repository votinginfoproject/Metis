/**
 * Created by bantonides on 1/3/14.
 */
var logger = (require('../logging/vip-winston')).Logger;
var _fileName = "matchMaker";

var updateCounter = 0;
var finished = false;
var _feedId;
var _models;
var _schemaVersion;


var when = require('when');
var _ = require('underscore');

/**
 * Creates relationships between documents in the database
 */
function onUpdate (err, numAffected) {
  updateCounter--;
  if (err) {
    logger.error(err);
  }
  else {
    logger.info('Updated ' + numAffected + ' document.');
  }

  if(updateCounter <= 0 && finished) {
    // matchmaker as a whole (end)
    logger.profileSeparately(_fileName);

    // rulesEngine as a whole (start)
    logger.profileSeparately("rulesEngine");

    logger.info('****Linking Complete!!!');
    var promise = require('./rule/rulesEngine').processRules(_feedId);


    promise.then(function(emptyPromise){
      // rulesEngine as a whole (end)
      logger.profileSeparately("rulesEngine");

      logger.info("****Processing Overview Details");
      require('./overview/overview-processor').runOverviewProcessor(_feedId)});
  }
};

function onError (err) {
  logger.error(err);
};

function updateRelationship (model, conditions, update, options, callback) {
  updateCounter++;
  model.update(conditions, update, options, callback);
};

function createRelationshipsFeed (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var sourcePromise = models.sources.findOne({ _feed: feedId }).exec();
  var sourceId;

  sourcePromise.then(function (source) {
    return models.electionofficials.findOne({ _feed: feedId, elementId: source.feedContactId }).select('_id').exec();
  }, onError).then(function (eoId) {
      updateRelationship(models.feeds, { _id: feedId }, { _feedContact: eoId }, onUpdate);

      logger.profile(_profileStr);
    }, onError);

  return sourcePromise;
};

function createRelationshipsSource (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var sourcePromise = models.sources.findOne({ _feed: feedId }).exec();
  var sourceId;

  sourcePromise.then(function (source) {
    sourceId = source._id;
    return models.electionofficials.findOne({ _feed: feedId, elementId: source.feedContactId }).select('_id').exec();
  }, onError).then(function (eoId) {
      updateRelationship(models.sources, { _id: sourceId }, { _feedContact: eoId }, onUpdate);
      logger.profile(_profileStr);
    }, onError);

  return sourcePromise;
};

function createRelationshipsState (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var statePromise = models.states.findOne({ _feed: feedId }).exec();
  var stateId;

  statePromise.then(function (state) {

    if(!state)
      return null;

    stateId = state._id;
    updateRelationship(models.elections, { _feed: feedId }, { _state: stateId }, onUpdate);
    updateRelationship(models.feeds, { _id: feedId }, { _state: stateId }, onUpdate);

    return models.electionadmins.findOne({ _feed: feedId, elementId: state.electionAdministrationId})
      .select('_id').exec();
  }, onError).then(function(eaId) {

    if(!eaId)
      return null;

      updateRelationship(models.states, { _id: stateId }, { _electionAdministration: eaId}, onUpdate);

      logger.profile(_profileStr);
    }, onError);

  var localityPromise = models.localitys.aggregate(
    { $match: { _feed: feedId } },
    { $group: {
      _id: "$stateId",
      localityIds: { $addToSet: '$_id' }
    } }).exec();

  localityPromise.then(function (localities) {
    logger.info(_profileStr + " locality count:" + localities.length);

    localities.forEach(function (locality) {
      updateRelationship(models.states, { _feed: feedId, elementId: locality._id },
        { $addToSet: { _localities: { $each: locality.localityIds } } }, onUpdate);
    });
  }, onError);

  return statePromise;
};

function createRelationshipsElection (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var electionPromise = models.elections.findOne({ _feed: feedId }).select('_id').exec();

  electionPromise.then(function (electionId) {
    updateRelationship(models.feeds, { _id: feedId }, { _election: electionId}, onUpdate);
    logger.profile(_profileStr);
  }, onError);

  return electionPromise;
};

function createRelationshipsLocality (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.localitys.find({ _feed: feedId }).exec();

  promise.then(function (localities) {
    logger.info(_profileStr + " locality count:" + localities.length);

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
    logger.profile(_profileStr);
  }, onError);

  return promise;
};

function createRelationshipsPrecinct (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.precincts.find({ _feed: feedId }).exec();

  promise.then(function (precincts) {
    logger.info(_profileStr + " precinct count:" + precincts.length);

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

    logger.profile(_profileStr);
  }, onError);

  return promise;
};

function createRelationshipsPrecinctSplit (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.precinctsplits.find({ _feed: feedId }).exec();

  promise.then(function (precinctSplits) {
    logger.info(_profileStr + " precinct splits count:" + precinctSplits.length);

    precinctSplits.forEach(function (precinctSplit) {
      if (precinctSplit.electoralDistrictIds.length > 0) {
        joinPrecinctSplitElectoralDistrict(models, precinctSplit);
      }
      if (precinctSplit.pollingLocationIds.length > 0) {
        joinPrecinctSplitPollingLocations(models, precinctSplit);
      }
      joinPrecinctSplitStreetSegments(models, precinctSplit);
    });

    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsElectionAdministration (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.electionadmins.find({ _feed: feedId }).exec();

  promise.then(function (electionAdmins) {
    logger.info(_profileStr + " electionAdmin count:" + electionAdmins.length);

    electionAdmins.forEach(function (electionAdmin) {

      if (electionAdmin.eoId) {
        joinElectionAdminElectionOfficial(models, electionAdmin);
      }
      if (electionAdmin.ovcId) {
        joinElectionAdminElectionOfficial(models, electionAdmin);
      }
    });

    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsContest (feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.contests.find({ _feed: feedId }).exec();

  promise.then(function (contests) {
    logger.info(_profileStr + " contest count:" + contests.length);

    contests.forEach(function (contest) {
      if (contest.electoralDistrictId) {
        joinContestElectoralDistrict(models, contest);
      }

      if (contest.ballotId) {
        joinContestBallot(models, contest);
      }

      if (contest.primaryPartyId) {
        joinContestParty(models, contest);
      }

      joinContestResults(models, contest);

    });

    logger.profile(_profileStr);

  });

  return promise;
};

function createRelationshipsElectoralDistrict(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.electoraldistricts.find({ _feed: feedId }).exec();

  promise.then(function (electoralDistricts) {
    logger.info(_profileStr + " electoralDistrict count:" + electoralDistricts.length);

    electoralDistricts.forEach(function(district) {
      joinElectoralDistrictPrecincts(models, district);
    });

    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsBallot(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.ballots.find({ _feed: feedId }).exec();

  promise.then(function(ballots) {
    logger.info(_profileStr + " ballot count:" + ballots.length);

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

    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsCustomBallot(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.customballots.find({ _feed: feedId }).exec();

  promise.then(function(cbs) {
    logger.info(_profileStr + " custom ballot count:" + cbs.length);

    if (cbs.length > 0) {
      cbs.forEach(function(cb) {
        joinCustomBallotResponses(models, cb);
      });
    }

    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsReferendum(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.referendums.find({ _feed: feedId }).exec();

  promise.then(function(referenda) {
    logger.info(_profileStr + " referenda count:" + referenda.length);

    if (referenda.length > 0) {
      referenda.forEach(function(referendum) {
        joinReferendumBallotResponses(models, referendum);
      });
    }
    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsContestResult(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.contestresults.find({ _feed: feedId }).exec();

  promise.then(function(results) {
    logger.info(_profileStr + " results count:" + results.length);

    if (results.length > 0) {
      results.forEach(function(result) {
        joinContestResultContest(models, result);
        joinContestResultJurisdiction(models, result);
      });
    }

    logger.profile(_profileStr);
  });

  return promise;
};

function createRelationshipsBallotLineResult(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.ballotlineresults.find({ _feed: feedId }).exec();

  promise.then(function(results) {
    logger.info(_profileStr + " results count:" + results.length);

    if (results.length > 0) {
      results.forEach(function(result) {
        joinBallotLineResultContest(models, result);
        joinBallotLineResultCandidate(models, result);
        joinBallotLineResultResponse(models, result);
        joinBallotLineResultJurisdiction(models, result);
      });
    }

    logger.profile(_profileStr);
  });

  return promise;
}

function createRelationshipsPollingLocation(feedId, models) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.pollinglocations.find({ _feed: feedId }).exec();

  promise.then(function(pollingLocations) {
    logger.info(_profileStr + " pollingLocation count:" + pollingLocations.length);

    if (pollingLocations.length > 0) {
      pollingLocations.forEach(function(pollingLocation) {
        joinPollingLocationPrecinct(models, pollingLocation);
        joinPollingLocationPrecinctSplit(models, pollingLocation);
      });
    }

    logger.profile(_profileStr);
  });

  return promise;
}

function createRelationshipsCandidate(feedId, models) {

  if(_schemaVersion !== '5.0') {
    return;
  }

  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.candidates.find({_feed: feedId}).exec();

  var defered = when.defer();

  promise.then(function(candidates) {

    if(!candidates)
      return;

    require('async').eachSeries(candidates, function(candidate, done) {
      if(candidate.partyId) {
        joinCandidateParty(models, candidate);
      }

      if(candidate.ballotId) {
        joinCandidateBallot(models, candidate, done);
      }
      else {
        done();
      }
    }, function() {
      defered.resolve();
    });

    logger.profile(_profileStr);
  });

  return defered.promise;
}

function createRelationshipsBallotStyle(feedId, models) {
  if(_schemaVersion != '5.0') {
    return;
  }

  var promise = models.ballotstyles.find({_feed: feedId}).exec();

  promise.then(function(ballotStyles) {
    ballotStyles.forEach(function(ballotStyle) {
      if(ballotStyle.contestIds.length) {
        joinBallotStyleContest(models, ballotStyle);
        joinBallotStyleCandidate(models, ballotStyle);
      }
    });
  });
}

function joinLocalityElectionAdmin (models, locality, eaId) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.electionadmins.findOne({ _feed: locality._feed, elementId: eaId }).select('_id').exec();

  promise.then(function (electionAdminOid) {
    updateRelationship(models.localitys, { _id: locality._id }, { _electionAdministration: electionAdminOid }, onUpdate);

    logger.profile(_profileStr);
  }, onError);
};

function joinLocalityEarlyVoteSite (models, locality, evsIds) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.earlyvotesites.find({ _feed: locality._feed, elementId: { $in: evsIds } }).select('_id').exec();

  promise.then(function (evsOids) {
    if (evsOids.length > 0) {
      updateRelationship(models.localitys, { _id: locality._id }, { $addToSet: { _earlyVoteSites: { $each: evsOids } } }, onUpdate);
      updateRelationship(models.earlyvotesites, { _id: { $in: evsOids } }, { _locality: locality._id }, { multi: true }, onUpdate);
    }

    logger.profile(_profileStr);
  }, onError);
};

function joinLocalityPrecincts (models, locality) {

  if(_schemaVersion == '5.0')
    return;

  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.precincts.find({ _feed: locality._feed, localityId: locality.elementId }).select('_id').exec();

  promise.then(function (precinctOids) {
    if (precinctOids.length > 0) {
      updateRelationship(models.localitys, { _id: locality._id }, { $addToSet: { _precincts: { $each: precinctOids } } }, onUpdate);

      logger.profile(_profileStr);
    }
  }, onError);
};

function joinPrecinctElectoralDistricts (models, precinct) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.electoraldistricts
    .find({ _feed: precinct._feed, elementId: { $in: precinct.electoralDistrictIds } })
    .select('_id')
    .exec();

  promise.then(function (edOids) {
    if (edOids.length > 0) {
      updateRelationship(models.precincts, { _id: precinct._id }, { $addToSet: { _electoralDistricts: { $each: edOids } } }, onUpdate);
    }

    logger.profile(_profileStr);
  }, onError);
};

function joinPrecinctEarlyVoteSites (models, precinct) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.earlyvotesites
    .find({ _feed: precinct._feed, elementId: { $in: precinct.earlyVoteSiteIds } })
    .select('_id')
    .exec();

  promise.then(function (evsOids) {
    if (evsOids.length > 0) {
      updateRelationship(models.precincts, { _id: precinct._id }, { $addToSet: { _earlyVoteSites: { $each: evsOids } } }, onUpdate);

      logger.profile(_profileStr);
    }
  }, onError);
};

function joinPrecinctPollingLocations (models, precinct) {

  if(_schemaVersion == '5.0')
    return;

  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.pollinglocations
    .find({ _feed: precinct._feed, elementId: { $in: precinct.pollingLocationIds } })
    .select('_id')
    .exec();

  promise.then(function (plOids) {
    if (plOids.length > 0) {
      updateRelationship(models.precincts, { _id: precinct._id }, { $addToSet: { _pollingLocations: { $each: plOids } } }, onUpdate);
    }

    logger.profile(_profileStr);
  }, onError);
};

function joinPrecinctPrecinctSplits (models, precinct) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.precinctsplits
    .find({ _feed: precinct._feed, precinctId: precinct.elementId })
    .select('_id')
    .exec();

  promise.then(function (psOids) {
    if (psOids.length > 0) {
      if(_schemaVersion == '3.0') {
        updateRelationship(models.precincts, { _id: precinct._id }, { $addToSet: { _precinctSplits: { $each: psOids } } }, onUpdate);
      }

      var psIds = psOids.map(function(ps) { return ps._id; });
      updateRelationship(models.precinctsplits, { _id: { $in: psIds } }, { _precinct: precinct }, { multi: true }, onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinPrecinctStreetSegments (models, precinct) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.streetsegments.find({ _feed: precinct._feed, precinctId: precinct.elementId })
    .select('_id')
    .exec();

  promise.then(function (streetOids) {
    if (streetOids.length > 0) {
      updateRelationship(models.precincts, { _id: precinct._id }, { $addToSet: { _streetSegments: { $each: streetOids } } }, onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinPrecinctSplitElectoralDistrict (models, precinctSplit) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.electoraldistricts
    .find({ _feed: precinctSplit._feed, elementId: { $in: precinctSplit.electoralDistrictIds } })
    .select('_id')
    .exec();

  promise.then(function (edOids) {
    if (edOids.length > 0) {
      updateRelationship(models.precinctsplits,
        { _id: precinctSplit._id },
        { $addToSet: { _electoralDistricts: { $each: edOids } } },
        onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinPrecinctSplitStreetSegments (models, precinctSplit) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.streetsegments.find({ _feed: precinctSplit._feed, precinctSplitId: precinctSplit.elementId })
    .select('_id')
    .exec();

  promise.then(function (streetOids) {
    if (streetOids.length > 0) {
      updateRelationship(models.precinctsplits,
        { _id: precinctSplit._id },
        { $addToSet: { _streetSegments: { $each: streetOids } } },
        onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinPrecinctSplitPollingLocations (models, precinctSplit) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.pollinglocations
    .find({ _feed: precinctSplit._feed, elementId: { $in: precinctSplit.pollingLocationIds } })
    .select('_id')
    .exec();

  promise.then(function (plOids) {
    if (plOids.length > 0) {
      updateRelationship(models.precinctsplits,
        { _id: precinctSplit._id },
        { $addToSet: { _pollingLocations: { $each: plOids } } },
        onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinElectionAdminElectionOfficial (models, electionAdmin) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promiseEO = models.electionofficials.findOne({ _feed: electionAdmin._feed, elementId: electionAdmin.eoId })
    .select('_id')
    .exec();

  var promiseOVC = models.electionofficials.findOne({ _feed: electionAdmin._feed, elementId: electionAdmin.ovcId })
    .select('_id')
    .exec();

  promiseEO.then(function (eo) {
    if (eo) {
      updateRelationship(models.electionadmins, { _id: electionAdmin._id }, { _electionOfficial: eo._id }, onUpdate);
    }
  });

  promiseOVC.then(function (ovc) {
    if (ovc) {
      updateRelationship(models.electionadmins, { _id: electionAdmin._id }, { _overseasVoterContact: ovc._id }, onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinContestElectoralDistrict (models, contest) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.electoraldistricts.findOne({ _feed: contest._feed, elementId: contest.electoralDistrictId })
    .select('_id')
    .exec();

  promise.then(function (ed) {
    if (ed) {
      updateRelationship(models.contests, { _id: contest._id }, { _electoralDistrict: ed._id }, onUpdate);
      updateRelationship(models.electoraldistricts, { _id: ed._id }, { _contest: contest }, onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinContestBallot (models, contest, done) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.ballots.findOne({ _feed: contest._feed, elementId: contest.ballotId })
    .select('_id')
    .exec();

  promise.then(function (ballot) {
    if (ballot) {
      updateRelationship(models.contests, { _id: contest._id }, { _ballot: ballot._id }, onUpdate);
    }

    if(done)
      done();

    logger.profile(_profileStr);

  });
};

function joinContestResults (models, contest) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promiseCR = models.contestresults.findOne({ _feed: contest._feed, contestId: contest.elementId })
    .select('_id')
    .exec();

  promiseCR.then(function(contestResult) {
    if (contestResult) {
      updateRelationship(models.contests, { _id: contest._id }, { _contestResult: contestResult._id }, onUpdate);
    }
  });

  var promiseBLR = models.ballotlineresults.find({ _feed: contest._feed, contestId: contest.elementId })
    .select('_id')
    .exec();

  promiseBLR.then(function(blrOids) {
    if (blrOids.length > 0) {
      updateRelationship(models.contests,
        { _id: contest._id },
        { $addToSet: { _ballotLineResults: { $each: blrOids } } },
        onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinElectoralDistrictPrecincts(models, electoralDistrict) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promisePrecincts = models.precincts
    .find({ _feed: electoralDistrict._feed, electoralDistrictIds: electoralDistrict.elementId })
    .select('_id')
    .exec();

  promisePrecincts.then(function(precincts) {
    if (precincts.length > 0) {
      updateRelationship(models.electoraldistricts,
        { _id: electoralDistrict._id },
        { $addToSet: { _precincts: { $each: precincts } } },
        onUpdate);
    }
  });

  var promisePrecinctSplits = models.precinctsplits
    .find({ _feed: electoralDistrict._feed, electoralDistrictIds: electoralDistrict.elementId })
    .select('_id')
    .exec();

  promisePrecinctSplits.then(function(precinctSplits) {
    if (precinctSplits.length > 0) {
      updateRelationship(models.electoraldistricts,
        { _id: electoralDistrict._id },
        { $addToSet: { _precinctSplits: { $each: precinctSplits } } },
        onUpdate);
    }

    logger.profile(_profileStr);
  });
};

function joinBallotCandidates(models, ballot) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var candidateIds = ballot.candidates.map(function(candidate) { return candidate.elementId });
  var promise = models.candidates.find({ _feed: ballot._feed, elementId: { $in: candidateIds } })
    .select('_id elementId')
    .exec();

  promise.then(function (candidates) {
    logger.info(_profileStr + " candidate count:" + candidates.length);

    candidates.forEach(function(candidate) {
      updateRelationship(models.ballots,
        {_id: ballot._id, 'candidates.elementId': candidate.elementId },
        {$set: { 'candidates.$._candidate': candidate._id } },
        onUpdate);
    });

    logger.profile(_profileStr);
  });
};

function joinBallotReferenda(models, ballot) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var referendumIds = ballot.referendumIds.map(function(referenda) { return referenda.elementId });
  var promise = models.referendums.find({ _feed: ballot._feed, elementId: { $in: referendumIds } })
    .select('_id elementId')
    .exec();

  promise.then(function(referenda) {

    // TODO - needs fix
    if (referenda.length > 0) {
      updateRelationship(models.ballots,
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

    logger.profile(_profileStr);

  });
};

function joinBallotCustomBallot(models, ballot) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var cbId = ballot.customBallotId;
  if(ballot.customBallotId.elementId)
    cbId = ballot.customBallotId.elementId;

  var promise = models.customballots.findOne({ _feed: ballot._feed, elementId: cbId})
    .select('_id')
    .exec();

  promise.then(function(customBallot) {
    updateRelationship(models.ballots, { _id: ballot._id }, { $set: { _customBallot: customBallot } },
    onUpdate);

    logger.profile(_profileStr);
  });
};

function joinCustomBallotResponses(models, customBallot) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var ballotResponseIds = customBallot.ballotResponses.map(function(resp) { return resp.elementId; });
  var promise = models.ballotresponses.find({ _feed: customBallot._feed, elementId: { $in: ballotResponseIds } })
    .select('_id elementId')
    .exec();

  promise.then(function(responses) {
    logger.info(_profileStr + " response count:" + responses.length);

    responses.forEach(function(resp) {
      updateRelationship(models.customballots,
        {_id: customBallot._id, 'ballotResponses.elementId': resp.elementId },
        {$set: { 'ballotResponses.$._response': resp._id } },
        onUpdate);
    });

    logger.profile(_profileStr);
  });
};

function joinReferendumBallotResponses(models, referendum) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var ballotResponseIds = referendum.ballotResponses.map(function(resp) {
    return resp.elementId;
  });
  var promise = models.ballotresponses.find({ _feed: referendum._feed, elementId: { $in: ballotResponseIds } })
    .select('_id elementId')
    .exec();

  promise.then(function(responses) {
    logger.info(_profileStr + " response count:" + responses.length);

    responses.forEach(function(resp) {
      updateRelationship(models.referendums,
        {_id: referendum._id, 'ballotResponses.elementId': resp.elementId },
        {$set: { 'ballotResponses.$._response': resp._id } },
        onUpdate);
    });

    logger.profile(_profileStr);
  });
};

function joinContestResultContest(models, result) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.contests.findOne({ _feed: result._feed, elementId: result.contestId })
    .select('_id')
    .exec();

  promise.then(function(contest) {
    updateRelationship(models.contestresults, { _id: result._id }, { _contest: contest }, onUpdate);

    logger.profile(_profileStr);
  });
};

function joinContestResultJurisdiction(models, result) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promiseState = models.states.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseLocality = models.localitys.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinct = models.precincts.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinctSplit = models.precinctsplits.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseElectoralDistrict = models.electoraldistricts.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  promiseState.then(function(state) {
    if (state) {
      updateRelationship(models.contestresults, { _id: result._id }, { _state: state }, onUpdate);
    }
  });

  promiseLocality.then(function(locality) {
    if (locality) {
      updateRelationship(models.contestresults, { _id: result._id }, { _locality: locality }, onUpdate);
    }
  });

  promisePrecinct.then(function(precinct) {
    if (precinct) {
      updateRelationship(models.contestresults, { _id: result._id }, { _precinct: precinct }, onUpdate);
    }
  });

  promisePrecinctSplit.then(function(precinctSplit) {
    if (precinctSplit) {
      updateRelationship(models.contestresults, { _id: result._id }, { _precinctSplit: precinctSplit }, onUpdate);
    }
  });

  promiseElectoralDistrict.then(function(district) {
    if (district) {
      updateRelationship(models.contestresults, { _id: result._id }, { _electoralDistrict: district }, onUpdate);
    }

    logger.profile(_profileStr);
  });
}

function joinBallotLineResultContest(models, result) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.contests.findOne({ _feed: result._feed, elementId: result.contestId })
    .select('_id')
    .exec();

  promise.then(function(contest) {
    updateRelationship(models.ballotlineresults, { _id: result._id }, { _contest: contest }, onUpdate);

    logger.profile(_profileStr);
  });
}

function joinBallotLineResultCandidate(models, result) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  if (result.candidateId) {
    var promise = models.candidates.findOne({ _feed: result._feed, elementId: result.candidateId })
      .select('_id')
      .exec();

    promise.then(function(candidate) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _candidate: candidate }, onUpdate);

      logger.profile(_profileStr);
    });
  }
}

function joinBallotLineResultResponse(models, result) {

  if (result.ballotResponseId) {

    var _profileStr = _fileName +"." + arguments.callee.name;
    logger.profile(_profileStr);

    var promise = models.ballotresponses.findOne({ _feed: result._feed, elementId: result.ballotResponseId })
      .select('_id')
      .exec();

    promise.then(function(response) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _ballotResponse: response }, onUpdate);

      logger.profile(_profileStr);
     });
  }
}


function joinBallotLineResultJurisdiction(models, result) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promiseState = models.states.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseLocality = models.localitys.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinct = models.precincts.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promisePrecinctSplit = models.precinctsplits.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  var promiseElectoralDistrict = models.electoraldistricts.findOne({ _feed: result._feed, elementId: result.jurisdictionId })
    .select('_id')
    .exec();

  promiseState.then(function(state) {
    if (state) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _state: state }, onUpdate);
    }
  });

  promiseLocality.then(function(locality) {
    if (locality) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _locality: locality }, onUpdate);
    }
  });

  promisePrecinct.then(function(precinct) {
    if (precinct) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _precinct: precinct }, onUpdate);
    }
  });

  promisePrecinctSplit.then(function(precinctSplit) {
    if (precinctSplit) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _precinctSplit: precinctSplit }, onUpdate);
    }
  });

  promiseElectoralDistrict.then(function(district) {
    if (district) {
      updateRelationship(models.ballotlineresults, { _id: result._id }, { _electoralDistrict: district }, onUpdate);
    }

    logger.profile(_profileStr);
  });
}

function joinPollingLocationPrecinct(models, pollingLocation) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.precincts.find({ _feed: pollingLocation._feed, pollingLocationIds: pollingLocation.elementId })
    .select('_id')
    .exec();

  promise.then(function(precincts) {
    updateRelationship(models.pollinglocations,
      { _id: pollingLocation._id },
      { $addToSet: { _precincts: { $each: precincts } } },
      onUpdate);

    logger.profile(_profileStr);
  });
}

function joinPollingLocationPrecinctSplit(models, pollingLocation) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.precinctsplits.find({ _feed: pollingLocation._feed, pollingLocationIds: pollingLocation.elementId })
    .select('_id')
    .exec();

  promise.then(function(precinctSplits) {
    updateRelationship(models.pollinglocations,
      { _id: pollingLocation._id },
      { $addToSet: { _precinctSplits: { $each: precinctSplits } } },
      onUpdate);

    logger.profile(_profileStr);
  });
}

function joinCandidateParty(models, candidate) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.parties.findOne({ _feed: candidate._feed, elementId: candidate.partyId })
    .select('_id')
    .exec();

  promise.then(function(party) {
    updateRelationship(models.candidates,
      { _id: candidate._id },
      { _party: party._id }, onUpdate);

    logger.profile(_profileStr);
  });
}

function joinContestParty(models, contest) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.parties.findOne({_feed: contest._feed, elementId: contest.primaryPartyId})
    .select('_id')
    .exec();

  promise.then(function(party) {
    updateRelationship(models.contests,
      { _id: contest._id },
      { _party: party._id }, onUpdate);

    logger.profile(_profileStr);
  });
}

function joinBallotContest(models, ballot) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var contestIds = ballot.contestIds.map(function(contest) { return contest.elementId });
  var promise = models.contests.find({_feed: ballot._feed, elementId: { $in: contestIds }})
    .select('_id')
    .exec();

  promise.then(function(contests) {
    updateRelationship(models.ballots,
      { _id: ballot._id },
      { $addToSet: { _contests: { $each: contests } }},
      onUpdate);

    logger.profile(_profileStr);
  });
};

function joinCandidateBallot(models, candidate, done) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var promise = models.ballots.findOne({ _feed: candidate._feed, elementId: candidate.ballotId })
    .exec();

  promise.then(function(ballot) {
    if(!ballot) {
      createMissingBallot(models, candidate, done);
    }
    else {
      done();
      updateRelationship(models.ballots,
        { _id: ballot._id },
        { $addToSet: { candidates: { elementId: candidate.elementId, sortOrder: candidate.sortOrder, _candidate: candidate._id } } }, onUpdate);
    }

    logger.profile(_profileStr);
  });
}


function createMissingBallot(models, candidate, done) {
  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var ballotId = require('mongoose').Types.ObjectId();
  var createPromise = models.ballots.create({
    elementId: candidate.ballotId,
    candidates: { elementId: candidate.elementId, sortOrder: candidate.sortOrder, _candidate: candidate._id },
    _feed: candidate._feed,
    _id: ballotId
  });

  createPromise.then(function(err) {

    var contestPromise = models.contests.find({ _feed: candidate._feed, ballotId: candidate.ballotId })
      .exec();

    contestPromise.then(function(contests) {
      done();
      updateRelationship(models.ballots,
        { _id: ballotId },
        { $addToSet: { candidates: { elementId: candidate.elementId, sortOrder: candidate.sortOrder, _candidate: candidate._id } } }, onUpdate);

      logger.info(_profileStr + " contest count:" + contest.length);

      contests.forEach(function(contest) {
        if(!contest._ballot) {
          joinContestBallot(models, contest, done);
        }
      });

      logger.profile(_profileStr);
    });
  });
}

function joinBallotStyleContest(models, ballotStyle) {
  var contestIds = ballotStyle.contestIds.map(function(contestId) { return contestId.contestId; });

  if(contestIds.length) {
    var promise = models.contests.find({ _feed: ballotStyle._feed, elementId: { $in: contestIds } })
      .select('_id')
      .exec();

    promise.then(function (contests) {
      contests.forEach(function (contest) {
        updateRelationship(models.contests, { _id: contest }, { $addToSet: {_ballotStyles: ballotStyle._id} }, onUpdate)
      });
    });
  }
}

function joinBallotStyleCandidate(models, ballotStyle) {
  var candidateIds = ballotStyle.contestIds.map(function(contestId) {
    return contestId.candidateIds.map(function(candidateId) { return candidateId.candidateId })
  });

  candidateIds = _.flatten(candidateIds);

  if(candidateIds.length) {
    var promise = models.candidates.find({ _feed: ballotStyle._feed, elementId: { $in: candidateIds }})
      .select('_id')
      .exec();

    promise.then(function (candidates) {
      candidates.forEach(function (candidate) {
        updateRelationship(models.candidates, { _id: candidate }, { $addToSet: {_ballotStyles: ballotStyle._id} }, onUpdate);
      });
    });
  }
}

function createDBRelationships(feedId, models, schemaVersion) {
  // matchmaker as a whole (start)
  logger.profileSeparately(_fileName);

  var _profileStr = _fileName +"." + arguments.callee.name;
  logger.profile(_profileStr);

  var createRelQue = [];

  _feedId = feedId;
  _models = models;
  _schemaVersion = schemaVersion;

  createRelQue.push(createRelationshipsFeed(feedId, models));
  createRelQue.push(createRelationshipsSource(feedId, models));
  createRelQue.push(createRelationshipsState(feedId, models));
  createRelQue.push(createRelationshipsElection(feedId, models));
  createRelQue.push(createRelationshipsLocality(feedId, models));
  createRelQue.push(createRelationshipsPrecinct(feedId, models));
  createRelQue.push(createRelationshipsPrecinctSplit(feedId, models));
  createRelQue.push(createRelationshipsElectionAdministration(feedId, models));
  createRelQue.push(createRelationshipsContest(feedId, models));
  createRelQue.push(createRelationshipsElectoralDistrict(feedId, models));
  createRelQue.push(createRelationshipsBallot(feedId, models));
  createRelQue.push(createRelationshipsCustomBallot(feedId, models));
  createRelQue.push(createRelationshipsReferendum(feedId, models));
  createRelQue.push(createRelationshipsContestResult(feedId, models));
  createRelQue.push(createRelationshipsBallotLineResult(feedId, models));
  createRelQue.push(createRelationshipsPollingLocation(feedId, models));
  createRelQue.push(createRelationshipsCandidate(feedId, models));
  createRelQue.push(createRelationshipsBallotStyle(feedId, models));

  when.all(createRelQue).then(function(docs) {
    finished = true;

    logger.profile(_profileStr);
  });
};

exports.createDBRelationships = createDBRelationships;