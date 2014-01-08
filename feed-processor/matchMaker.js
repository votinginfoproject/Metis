/**
 * Created by bantonides on 1/3/14.
 */

/**
 * Creates relationships between documents in the database
 */
function onUpdate (err, numAffected) {
  if (err) {
    console.error(err);
  }
  else {
    console.log('Updated ' + numAffected + ' document.')
  }
};

function onError (err) {
  console.error(err);
};

function createRelationshipsSource (feedId, models) {
  var sourcePromise = models.Source.findOne({ _feed: feedId }).exec();
  var sourceId;

  sourcePromise.then(function (source) {
    sourceId = source._id;
    return models.ElectionOfficial.findOne({ _feed: feedId, elementId: source.feedContactId }).select('_id').exec();
  }, onError).then(function (eoId) {
      models.Source.update({ _id: sourceId }, { _feedContact: eoId }, onUpdate);
    }, onError);
};

function createRelationshipsState (feedId, models) {
  var statePromise = models.State.findOne({ _feed: feedId }).exec();
  var stateId;

  statePromise.then(function (state) {
    stateId = state._id;
    models.Election.update({ _feed: feedId }, { _state: stateId }, onUpdate);
    models.Feed.update({ _id: feedId }, { _state: stateId }, onUpdate);

    return models.ElectionAdmin.findOne({ _feed: feedId, elementId: state.electionAdministrationId})
      .select('_id').exec();
  }, onError).then(function(eaId) {
      models.State.update({ _id: stateId }, { _electionAdministration: eaId}, onUpdate);
    }, onError);

  var localityPromise = models.Locality.aggregate(
    { $match: { _feed: feedId } },
    { $group: {
      _id: "$stateId",
      localityIds: { $addToSet: '$_id' }
    } }).exec();

  localityPromise.then(function (localities) {
    localities.forEach(function (locality) {
      models.State.update({ _feed: feedId, elementId: locality._id },
        { $push: { _localities: { $each: locality.localityIds } } }, onUpdate);
    });
  }, onError);
};

function createRelationshipsElection (feedId, models) {
  var electionPromise = models.Election.findOne({ _feed: feedId }).select('_id').exec();

  electionPromise.then(function (electionId) {
    models.Feed.update({ _id: feedId }, { _election: electionId}, onUpdate);
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

function joinLocalityElectionAdmin (models, locality, eaId) {
  var promise = models.ElectionAdmin.findOne({ _feed: locality._feed, elementId: eaId }).select('_id').exec();

  promise.then(function (electionAdminOid) {
    models.Locality.update({ _id: locality._id }, { _electionAdministration: electionAdminOid }, onUpdate);
  }, onError);
};

function joinLocalityEarlyVoteSite (models, locality, evsIds) {
  var promise = models.EarlyVoteSite.find({ _feed: locality._feed, elementId: { $in: evsIds } }).select('_id').exec();

  promise.then(function (evsOids) {
    if (evsOids.length > 0) {
      models.Locality.update({ _id: locality._id }, { $addToSet: { _earlyVoteSites: { $each: evsOids } } }, onUpdate);
      models.EarlyVoteSite.update({ _id: { $in: evsOids } }, { _locality: locality._id }, { multi: true }, onUpdate);
    }
  }, onError);
};

function joinLocalityPrecincts (models, locality) {
  var promise = models.Precinct.find({ _feed: locality._feed, localityId: locality.elementId }).select('_id').exec();

  promise.then(function (precinctOids) {
    if (precinctOids.length > 0) {
      models.Locality.update({ _id: locality._id }, { $addToSet: { _precincts: { $each: precinctOids } } }, onUpdate);
    }
  }, onError);
};

function createDBRelationships(feedId, models) {
  createRelationshipsSource(feedId, models);
  createRelationshipsState(feedId, models);
  createRelationshipsElection(feedId, models);
  createRelationshipsLocality(feedId, models);
};

exports.createDBRelationships = createDBRelationships;