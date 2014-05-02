/**
 * Created by bantonides on 3/12/14.
 */
const
  unfold = require('when/unfold');

module.exports = function () {
  var updateQ = [];
  var unfolding = false;

  var count = 0;

  function consolidateBallot(models, feedId) {
    var promise = models.ballotcandidate.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$ballotId", candidates: { $push: { elementId: "$candidateId", sortOrder: "$sortOrder" } } } }
    ).exec();

    updateQ.push(promise);

    promise.then(function (groupedCandidates) {
      groupedCandidates.forEach(function (candidates) {
        count++;
        updateQ.push(models.ballots.update(
          { _feed: feedId, elementId: candidates._id },
          { candidates: candidates.candidates }).exec());
      });
    });
  }

  function consolidateCustomBallot(models, feedId) {
    var promise = models.customballotballotresponse.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$customBallotId", ballotResponses: { $push: { elementId: "$ballotResponseId", sortOrder: "$sortOrder" } } } }
    ).exec();

    updateQ.push(promise);

    promise.then(function (groupedBallotResponses) {
      groupedBallotResponses.forEach(function (responses) {
        count++;
        updateQ.push(models.customballots.update(
          { _feed: feedId, elementId: responses._id },
          { ballotResponses: responses.ballotResponses }).exec());
      });
    });
  }

  function consolidateLocality(models, feedId) {
    var promise = models.localityearlyvotesite.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$localityId", earlyVoteSites: { $push: "$earlyVoteSiteId" } } }
    ).exec();

    updateQ.push(promise);

    promise.then(function (groupedEarlyVoteSites) {
      groupedEarlyVoteSites.forEach(function (earlyVoteSites) {
        count++;
        updateQ.push(models.localitys.update(
          { _feed: feedId, elementId: earlyVoteSites._id },
          { earlyVoteSiteIds: earlyVoteSites.earlyVoteSites }).exec());
      });
    });
  }

  function consolidatePrecinct(models, feedId) {
    var promiseEVS = models.precinctearlyvotesite.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$precinctId", earlyVoteSites: { $push: "$earlyVoteSiteId" } } }
    ).exec();

    updateQ.push(promiseEVS);

    promiseEVS.then(function (groupedEarlyVoteSites) {
      groupedEarlyVoteSites.forEach(function (earlyVoteSites) {
        count++;
        updateQ.push(models.precincts.update(
          { _feed: feedId, elementId: earlyVoteSites._id },
          { earlyVoteSiteIds: earlyVoteSites.earlyVoteSites }).exec());
      });
    });

    var promiseED = models.precinctelectoraldistrict.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$precinctId", electoralDistricts: { $push: "$electoralDistrictId" } } }
    ).exec();

    updateQ.push(promiseED);

    promiseED.then(function (groupedElectoralDistricts) {
      groupedElectoralDistricts.forEach(function (electoralDistricts) {
        count++;
        updateQ.push(models.precincts.update(
          { _feed: feedId, elementId: electoralDistricts._id },
          { electoralDistrictIds: electoralDistricts.electoralDistricts }).exec());
      });
    });

    var promisePL = models.precinctpollinglocation.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$precinctId", pollingLocations: { $push: "$pollingLocationId" } } }
    ).exec();

    updateQ.push(promisePL);

    promisePL.then(function (groupedPollingLocations) {
      groupedPollingLocations.forEach(function (pollingLocations) {
        count++;
        updateQ.push(models.precincts.update(
          { _feed: feedId, elementId: pollingLocations._id },
          { pollingLocationIds: pollingLocations.pollingLocations }).exec());
      });
    });
  }

  function consolidatePrecinctSplit(models, feedId) {
    var promiseED = models.precinctsplitelectoraldistrict.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$precinctSplitId", electoralDistricts: { $push: "$electoralDistrictId" } } }
    ).exec();

    updateQ.push(promiseED);

    promiseED.then(function (groupedElectoralDistricts) {
      groupedElectoralDistricts.forEach(function (electoralDistricts) {
        count++;
        updateQ.push(models.precinctsplits.update(
          { _feed: feedId, elementId: electoralDistricts._id },
          { electoralDistrictIds: electoralDistricts.electoralDistricts }).exec());
      });
    });

    var promisePL = models.precinctsplitpollinglocation.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$precinctSplitId", pollingLocations: { $push: "$pollingLocationId" } } }
    ).exec();

    updateQ.push(promisePL);

    promisePL.then(function (groupedPollingLocations) {
      groupedPollingLocations.forEach(function (pollingLocations) {
        count++;
        updateQ.push(models.precinctsplits.update(
          { _feed: feedId, elementId: pollingLocations._id },
          { pollingLocationIds: pollingLocations.pollingLocations }).exec());
      });
    });
  }

  function consolidateReferendum(models, feedId) {
    var promise = models.referendumballotresponse.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$referendumId", ballotResponses: { $push: { elementId: "$ballotResponseId", sortOrder: "$sortOrder" } } } }
    ).exec();

    updateQ.push(promise);

    promise.then(function (groupedBallotResponses) {
      groupedBallotResponses.forEach(function (ballotResponses) {
        count++;
        updateQ.push(models.referendums.update(
          { _feed: feedId, elementId: ballotResponses._id },
          { ballotResponses: ballotResponses.ballotResponses }).exec());
      });
    });
  }

  function consolidateState(models, feedId) {
    var promise = models.stateearlyvotesite.aggregate(
      { $match: { _feed: feedId } },
      { $group: { _id: "$stateId", earlyVoteSites: { $push: "$earlyVoteSiteId" } } }
    ).exec();

    updateQ.push(promise);

    promise.then(function (groupedEarlyVoteSites) {
      groupedEarlyVoteSites.forEach(function (earlyVoteSites) {
        count++;
        updateQ.push(models.states.update(
          { _feed: feedId, elementId: earlyVoteSites._id },
          { earlyVoteSiteIds: earlyVoteSites.earlyVoteSites }).exec());
      });
    });
  }

  function startUnfold(models, feedId) {
    if (unfolding) {
      return;
    }

    console.log('Starting unfold');

    unfolding = true;
    unfold(unspool, condition, log, 0)
      .catch(function (err) {
        console.error(err);
      })
      .then(function () {
        console.log('unfold completed!!!!');
        console.log('Creating database relationships...');
        require('./matchMaker').createDBRelationships(feedId, models);
      });
  }

  function unspool(count) {
    var currentUpdate = updateQ.shift();
    return [currentUpdate, count++];
  }

  function condition() {
    if (updateQ.length == 0) {
      console.log('updateQ empty');
      unfolding = false;
    }

    return updateQ.length == 0;
  }

  function log(data) {
//    console.log(data);
  }

  return {
    consolidate: function (models, feedId) {
      consolidateBallot(models, feedId);
      consolidateCustomBallot(models, feedId);
      consolidateLocality(models, feedId);
      consolidatePrecinct(models, feedId);
      consolidatePrecinctSplit(models, feedId);
      consolidateReferendum(models, feedId);
      consolidateState(models, feedId);
      console.log('all consolidates called.')

      startUnfold(models, feedId);

    }
  };
};