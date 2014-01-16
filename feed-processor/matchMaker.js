/**
 * Created by bantonides on 1/3/14.
 */
var updateCounter = 0;
var _feedId;

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
    require('./rule/ruleEngine').analyzeRules(_feedId);
  }
};

function onError (err) {
  console.error(err);
};

function updateRelationship (model, conditions, update, options, callback) {
  updateCounter++;
  model.update(conditions, update, options, callback);
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
      updateRelationship(models.Precinct, { _id: precinct._id }, { $addToSet: { _precinctSplits: { $each: psOids } } }, onUpdate);
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
}

function createDBRelationships(feedId, models) {
  createRelationshipsSource(feedId, models);
  createRelationshipsState(feedId, models);
  createRelationshipsElection(feedId, models);
  createRelationshipsLocality(feedId, models);
  createRelationshipsPrecinct(feedId, models);
  createRelationshipsPrecinctSplit(feedId, models);
  createRelationshipsElectionAdministration(feedId, models);
  _feedId = feedId;
};

exports.createDBRelationships = createDBRelationships;