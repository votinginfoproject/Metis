/**
 * Created by bantonides on 1/3/14.
 */
var linkingComplete = false;
var updateCounter = 0;

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
    process.exit();
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

function createDBRelationships(feedId, models) {
  createRelationshipsSource(feedId, models);
  createRelationshipsState(feedId, models);
  createRelationshipsElection(feedId, models);
  createRelationshipsLocality(feedId, models);
  createRelationshipsPrecinct(feedId, models);
};

exports.createDBRelationships = createDBRelationships;