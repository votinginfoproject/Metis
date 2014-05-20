/**
 * Created by Akelaus on 12/4/13.
 */

var logger = (require('../logging/vip-winston')).Logger;
var feedIdMapper = require('../feedIdMapper');

//app configuration
var config = require('../config');

//database setup
var mongoose = require('mongoose');
var daoSchemas = require('./schemas');
var when = require('when');

var logger = (require('../logging/vip-winston')).Logger;

function dbConnect() {

  // turn on for debug level mongoose logging
  //mongoose.set('debug', true);

  mongoose.connection.on('error', function(err) {
    logger.error('MongoDB error: ' + err);
  });

  mongoose.connect(config.mongoose.connectionString);
  var db = mongoose.connection;

  db.on('error', logger.error.bind(logger, 'MongoDB connection error: '));
  db.once('open', function callback(){
    logger.info("Initializing Mongoose...");
    daoSchemas.initSchemas(mongoose);
    logger.info("Initialized Mongoose for VIP database.");

    // TODO: don't startup app until both calls below complete as we don't want the app to allow users to
    // login until the setup below is complete. However In 99.9% of cases, the calls below will be completed
    // before the app allows users to login

    // 1)
    // load the friendly id map into memory
    feedIdMapper.loadUserFriendlyIdMap();

    // 2)
    // go through the Feeds and mark any feeds that are in the middle of processing as failed as we
    // are making this check on startup, it means that the app has been restarted while a feed was
    // processing
    daoSchemas.models.feeds.find({ complete: false, failed: false }, { payload: 0 })
    .exec(function(err, feeds){

        for(var i=0; i< feeds.length; i++){

          var feed = feeds[i];
          daoSchemas.models.feeds.update({_id: feed._id}, { feedStatus: "Stopped (App was Shutdown while Processing)", complete: false, failed: true }, function(err, result) {
            logger.info("Marked feed" + feed._id + " as failed as it was processing while the App was shutdown/restarted.")
          });
        }
    });


  });
};

function getFeedList (callback) {
  daoSchemas.models.feeds.find({}, { payload: 0 })
    .populate('_state')
    .populate('_election', 'electionType date')
    .exec(callback);
};

function getFeedOverview (id, callback) {

  if(!id) {
    logger.error('db.getFeedOverview: bad FeedID!', id);
    return;
  }

  daoSchemas.models.feeds.findById(id, { payload: 0 })
    .populate('_state')
    .populate('_feedContact')
    .populate('_election')
    .exec(function(err, overview) {

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

      if(overview !== undefined && overview !== null){
        overview.errorCount = 0;

        var errorQueries = allErrorModels.map(function (model) {
          return model.count({_feed: overview._id}).exec();
        });

        when.all(errorQueries).then(function(counts) {
          counts.forEach(function(count) {
            overview.errorCount += count;
          });
          callback(null, overview);
        });
      } else {
        callback(null, overview);
      }
    });
};

function getFeedSource (feedId, callback) {
  daoSchemas.models.sources.findOne({ _feed: feedId }).populate('_feedContact').exec(function(err, source) {
    daoSchemas.models.sources.Error.count({ _feed: feedId }, function(err, count) {
      source.errorCount = count;
      callback(null, source);
    });
  });
};

function getFeedElection (feedId, callback) {
  var election;
  var promise = daoSchemas.models.elections.findOne({ _feed: feedId }).populate('_state').exec();

  promise.then(function(elec) {
    election = elec;
    return daoSchemas.models.localitys.count({ _feed: feedId }).exec();
  }).then(function(localityCount) {
      election._state.localityCount = localityCount;
      return daoSchemas.models.elections.Error.count({_feed: feedId}).exec();
    }).then(function(count) {
      election.errorCount = count;
      callback(null, election);
    });
};

function getElectionOfficial (feedId, officialId, callback) {
  daoSchemas.models.electionofficials.findOne( { _feed: feedId, elementId: officialId }, callback);
};

function getFeedContests (feedId, callback) {
  daoSchemas.models.contests.find( { _feed: feedId}, callback);
};

function getFeedContestResults (feedId, callback) {
  daoSchemas.models.contestresults.find( { _feed: feedId})
    .populate('_contest')
    .populate('_state')
    .populate('_locality')
    .populate('_precinct')
    .populate('_precinctSplit')
    .populate('_electoralDistrict')
    .exec(callback);
};

function getFeedBallotLineResults (feedId, callback) {
  daoSchemas.models.ballotlineresults.find( { _feed: feedId})
    .populate('_candidate')
    .populate('_contest')
    .populate('_state')
    .populate('_locality')
    .populate('_precinct')
    .populate('_precinctSplit')
    .populate('_electoralDistrict')
    .exec(callback);
};

function getState (feedId, callback) {
  var promise = daoSchemas.models.states.findOne({ _feed: feedId })
    .populate('_electionAdministration')
    .populate('_localities')
    .exec();
  promise.then(function(state) {
    daoSchemas.models.states.Error.count({_feed: feedId}, function(err, count) {
      state.errorCount = count;
      callback(null, state);
    });
  });
};

function getStateEarlyVoteSites (feedId, callback) {
  daoSchemas.models.earlyvotesites.find({ _feed: feedId }, callback);
};

function getLocalities (feedId, callback) {
  daoSchemas.models.localitys.find({ _feed: feedId }, callback);
};

function getLocality (feedId, localityId, callback) {
  var promise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId })
    .populate('_electionAdministration')
    .exec();

  promise.then(function(locality) {
    daoSchemas.models.localitys.Error.count({_feed: feedId, _ref: locality._id}, function(err, count) {
      locality.errorCount = count;
      callback(null, locality);
    })
  })
};

function getLocalityEarlyVoteSite (feedId, localityId, callback) {
  var promise = daoSchemas.models.earlyvotesites.find({ _feed: feedId })
    .populate('_locality')
    .exec();

  promise.then(function (earlyVoteSites) {
    var evs = earlyVoteSites.filter(function(site) {
      return site._locality && site._locality.elementId == localityId;
    });
    daoSchemas.models.earlyvotesites.Error.count({_feed: feedId, _ref: evs._id}, function(err, count){
      evs.errorCount = count;
      callback(undefined, evs);
    });
  });
};

function getLocalityPrecincts (feedId, localityId, callback) {
  daoSchemas.models.precincts.find({ _feed: feedId, localityId: localityId }, callback);
};

function getLocalityPrecinct (feedId, precinctId, callback) {
  var promise = daoSchemas.models.precincts.findOne({ _feed: feedId, elementId: precinctId }).exec();

  promise.then(function(precinct) {
    daoSchemas.models.precincts.Error.count({_feed: feedId, _ref: precinct._id}, function(err, count) {
      precinct.errorCount = count;
      daoSchemas.models.streetsegments.Error.count({_feed: feedId, _ref: { $in: precinct._streetSegments }}, function(err, count) {
        precinct._streetSegments.errorCount = count;
        callback(null, precinct);
      })
    });
  });
};

function getLocalityPrecinctEarlyVoteSites (feedId, precinctId, callback) {
  var promise = daoSchemas.models.precincts.findOne({ _feed: feedId, elementId: precinctId })
    .select('_earlyVoteSites')
    .exec();

  promise.then(function (precinct) {
    if (precinct) {
      daoSchemas.models.earlyvotesites.find({ _id: { $in: precinct._earlyVoteSites } }, callback);
    }
    else { callback(undefined); }
  })
};

function getPrecinctElectoralDistricts (feedId, precinctId, callback) {
  var promise = daoSchemas.models.precincts.findOne({ _feed: feedId, elementId: precinctId })
    .select('_electoralDistricts')
    .exec();

  promise.then(function (precinct) {
    if (precinct) {
      daoSchemas.models.electoraldistricts.find({ _id: { $in: precinct._electoralDistricts } }, callback);
    }
    else { callback(undefined); }
  });
};

function getPrecinctPollingLocations (feedId, precinctId, callback) {
  var promise = daoSchemas.models.precincts.findOne({ _feed: feedId, elementId: precinctId })
    .select('_pollingLocations')
    .exec();

  promise.then(function (precinct) {
    if (precinct) {
      daoSchemas.models.pollinglocations.find({ _id: { $in: precinct._pollingLocations } }, callback);
    }
    else { callback(undefined); }
  });
};

function getPrecinctPrecinctSplits (feedId, precinctId, callback) {
  daoSchemas.models.precinctsplits.find({ _feed: feedId, precinctId: precinctId }, callback);
};

function getPrecinctStreetSegments (feedId, precinctId, callback) {
  daoSchemas.models.streetsegments.find({ _feed: feedId, precinctId: precinctId }, callback);
};

function feedPrecinctSplit (feedId, precinctSplitId, callback) {
  var promise = daoSchemas.models.precinctsplits.findOne({ _feed: feedId, elementId: precinctSplitId }).exec();

  promise.then(function(split) {
    daoSchemas.models.precinctsplits.Error.count({_feed: feedId, _ref: split._id}, function(err, count) {
      split.errorCount = count;
      daoSchemas.models.streetsegments.Error.count({_feed: feedId, _ref: { $in: split._streetSegments }}, function(err, count) {
        split._streetSegments.errorCount = count;
        callback(null, split);
      })
    })
  });
};

function feedPrecinctSplitElectoralDistricts (feedId, precinctSplitId, callback) {
  var promise = daoSchemas.models.precinctsplits.findOne({ _feed: feedId, elementId: precinctSplitId })
    .populate('_electoralDistricts')
    .select('_electoralDistricts')
    .exec();

  promise.then(function (precinctSplit) {
    if (precinctSplit) {
      var promises = precinctSplit._electoralDistricts.map(function(district) {
        return daoSchemas.models.contests.count({_feed: feedId, _electoralDistrict: district._id}).exec();
      });

      when.all(promises).then(function(counts) {

        for(var i = 0; i < precinctSplit._electoralDistricts.length; ++i) {
          precinctSplit._electoralDistricts[i].contests = counts[i];
        }

        callback(undefined, precinctSplit._electoralDistricts);
      });
    }
    else { callback(undefined); }
  });
};

function feedPrecinctSplitPollingLocations (feedId, precinctSplitId, callback) {
  var promise = daoSchemas.models.precinctsplits.findOne({ _feed: feedId, elementId: precinctSplitId })
    .populate('_pollingLocations')
    .select('_pollingLocations')
    .exec();

  promise.then(function (precinctSplit) {
    if (precinctSplit) {
      callback(undefined, precinctSplit._pollingLocations);
    }
    else { callback(undefined); }
  });
};

function feedPrecinctSplitStreetSegments (feedId, precinctSplitId, callback) {
  daoSchemas.models.streetsegments.find({ _feed: feedId, precinctSplitId: precinctSplitId }, callback);
};

function feedEarlyVoteSite (feedId, earlyVoteSiteId, callback) {
  var promise = daoSchemas.models.earlyvotesites.findOne({ _feed: feedId, elementId: earlyVoteSiteId }).exec();

  promise.then(function(evs) {
    daoSchemas.models.earlyvotesites.Error.count({_feed: feedId, _ref: evs._id}, function(err, count) {
      evs.errorCount = count;
      callback(null, evs);
    });
  });
};

function feedStateElectionAdministration (feedId, callback) {
  var promise = daoSchemas.models.states.findOne({ _feed: feedId })
    .populate('_electionAdministration')
    .exec();

  promise.then(function (state) {
    if (state && state._electionAdministration) {
      state._electionAdministration.populate('_electionOfficial _overseasVoterContact', function(err, admin) {
        daoSchemas.models.electionadmins.Error.count({_feed: feedId, _ref: admin._id}, function(err, count) {
          admin.errorCount = count;
          callback(null, admin);
        });
      });
    }
    else { callback(); }
  });
};

function feedLocalityElectionAdministration (feedId, localityId, callback) {
  var promise = daoSchemas.models.localitys.findOne({ _feed: feedId, elementId: localityId })
    .populate('_electionAdministration')
    .exec();

  promise.then(function (locality) {
    if (locality && locality._electionAdministration) {
      locality._electionAdministration.populate('_electionOfficial _overseasVoterContact', function(err, admin) {
        daoSchemas.models.electionadmins.Error.count({_feed: feedId, _ref: admin._id}, function(err, count) {
          admin.errorCount = count;
          callback(null, admin);
        });
      });
    }
    else { callback(); }
  });
};

function feedContest (feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_ballot _electoralDistrict _contestResult _ballotLineResults _party')
    .exec();

  promise.then(function(contest) {
    daoSchemas.models.contests.Error.count({_feed: feedId, _ref: contest._id}, function(err, count) {
      contest.errorCount = count;
      callback(null, contest);
    })
  })
};

function feedContestElectoralDistrict(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_electoralDistrict')
    .exec();

  promise.then(function(contest) {
    return daoSchemas.models.electoraldistricts.populate(contest._electoralDistrict,
      [
        { path: '_contest', model: daoSchemas.models.contests.modelName },
        { path: '_precincts', model: daoSchemas.models.precincts.modelName },
        { path: '_precinctSplits', model: daoSchemas.models.precinctsplits.modelName }
      ]);
  }).then(function(electoralDistrict) {
      electoralDistrict.populate(
        { path: '_precinctSplits._precinct', select: 'localityId', model: daoSchemas.models.precincts.modelName }, function(err, district) {
          daoSchemas.models.electoraldistricts.Error.count({_feed: feedId, _ref: district._id}, function(err, count) {
            district.errorCount = count;
            callback(null, district);
          });
        });
    });
};

function feedElectoralDistrict(feedId, districtId, callback) {
  var promise = daoSchemas.models.electoraldistricts.findOne({ _feed: feedId, elementId: districtId })
    .exec();

  promise.then(function(electoralDistrict) {
    return daoSchemas.models.electoraldistricts.populate(electoralDistrict,
      [
        { path: '_contest', model: daoSchemas.models.contests.modelName },
        { path: '_precincts', model: daoSchemas.models.precincts.modelName },
        { path: '_precinctSplits', model: daoSchemas.models.precinctsplits.modelName }
      ]);
  }).then(function(electoralDistrict) {
      electoralDistrict.populate(
        { path: '_precinctSplits._precinct', select: 'localityId', model: daoSchemas.models.precincts.modelName }, function(err, district) {
          daoSchemas.models.electoraldistricts.Error.count({_feed: feedId, _ref: electoralDistrict._id}, function(err, count) {
            district.errorCount = count;
            callback(null, district);
          });
        });
    });
};

function feedContestBallot(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_ballot')
    .exec();

  promise.then(function (contest) {
    if (contest) {
      return daoSchemas.models.ballots.populate(contest._ballot,
      [
        { path: '_referenda', model: daoSchemas.models.referendums.modelName },
        { path: 'candidates._candidate', model: daoSchemas.models.candidates.modelName },
        { path: '_customBallot', model: daoSchemas.models.customballots.modelName },
        { path: '_contests', model: daoSchemas.models.contests.modelName }
      ]);
    }
    else {
      callback(undefined, null);
    }
  }).then(function(ballot) {
      daoSchemas.models.ballotresponses.populate(ballot,
        { path: '_customBallot.ballotResponses._response' }, function(err, bal) {
          daoSchemas.models.ballots.Error.count({_feed: feedId, refElementId: bal.elementId}, function(err, count) {
            bal.errorCount = count;
            if(!bal['_customBallot']) {
              callback(null, bal);
              return;
            }

            daoSchemas.models.customballots.Error.count({_feed: feedId, refElementId: bal._customBallot.elementId}, function(err, customCount) {
              bal._customBallot.errorCount = customCount;

              var responses = bal._customBallot.ballotResponses.map(function(response) { return response._response.elementId; });
              daoSchemas.models.ballotresponses.Error.count({_feed: feedId, refElementId: { $in: responses}}, function(err, responsesCount) {
                bal._customBallot.ballotResponseErrorCount = responsesCount;
                callback(null, bal);
              })
            });
          });
        });
    });
};

function feedBallotCandidates(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_ballot')
    .exec();

  promise.then(function (contest) {
    if (contest) {
      return daoSchemas.models.candidates.populate(contest._ballot, { path: 'candidates._candidate' });
    }
    else {
      callback(undefined, null);
    }
  }).then(function(ballot) {
      callback(undefined, ballot.candidates);
    });
};

function feedCandidate(feedId, candidateId, callback) {
  var promise = daoSchemas.models.candidates.findOne({ _feed: feedId, elementId: candidateId })
    .populate('_party')
    .exec();

  promise.then(function(candidate) {
    daoSchemas.models.candidates.Error.count({_feed: feedId, _ref: candidate._id}, function(err, count) {
      candidate.errorCount = count;
      callback(null, candidate);
    });
  });
};

function feedBallotReferenda(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_ballot')
    .exec();

  promise.then(function(contest) {
    if (contest && contest._ballot) {
      return daoSchemas.models.ballots.populate(contest._ballot, '_referenda');
    } else {
      callback(undefined, null);
    }
  }).then(function(ballot) {
      daoSchemas.models.ballotresponses.populate(ballot._referenda, 'ballotResponses._response', callback);
    });
};

function feedBallotReferendum(feedId, referendumId, callback) {
  var promise = daoSchemas.models.referendums
    .findOne({ _feed: feedId, elementId: referendumId })
    .populate('ballotResponses._response')
    .exec();

  promise.then(function(referendum) {
    daoSchemas.models.referendums.Error.count({_feed: feedId, _ref: referendum._id}, function(err, count) {
      referendum.errorCount = count;
      var responses = referendum.ballotResponses.map(function(response) { return response._response.elementId });
      daoSchemas.models.ballotresponses.Error.count({_feed: feedId, refElementId: { $in: responses }}, function(err, responseCount) {
        referendum.ballotResponsesErrorCount = responseCount;
        callback(null, referendum);
      });
    });
  });
};

function getPollingLocation(feedId, pollingLocationId, callback) {
  var promise = daoSchemas.models.pollinglocations
    .findOne({ _feed: feedId, elementId: pollingLocationId })
    .populate('_precincts _precinctSplits')
    .exec();

  promise.then(function(location) {
    daoSchemas.models.pollinglocations.Error.count({_feed: feedId, refElementId: location.elementId}, function(err, count){
      location.errorCount = count;
      callback(null, location);
    });
  });
};

function getContestResult(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_contestResult')
    .exec();

  promise.then(function(contest) {
    return daoSchemas.models.contestresults.populate(contest._contestResult, '_contest _state _locality _precinct _precinctSplit _electoralDistrict');
  }).then(function(contestResult) {
      contestResult.populate(
        { path: '_precinctSplit._precinct', select: 'localityId', model: daoSchemas.models.precincts.modelName }, function(err, result) {
          daoSchemas.models.contestresults.Error.count({ _feed: feedId, _ref: contestResult._id}, function(err, count) {
            result.errorCount = count;
            callback(null, result);
          });
        });
    });
}

function getContestBallotLineResults(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_ballotLineResults')
    .exec()

  promise.then(function(contest) {
    if (contest) {
      callback(undefined, contest._ballotLineResults);
    } else { callback(undefined, null); }

  });
}

function getBallotLineResult(feedId, blrId, callback) {
  var promise = daoSchemas.models.ballotlineresults.findOne({ _feed: feedId, elementId: blrId })
    .populate('_contest _candidate _ballotResponse _state _locality _precinct _precinctSplit _electoralDistrict')
    .exec();

  promise.then(function(blr) {
    blr.populate(
      { path: '_precinctSplit._precinct', select: 'localityId', model: daoSchemas.models.precincts.modelName }, function(err, blr) {
      daoSchemas.models.ballotlineresults.Error.count({ _feed: feedId, _ref: blr._id }, function(err, count) {
        blr.errorCount = count;
        callback(null, blr);
      });
    });
  });
}

function getContestBallotStyles(feedId, contestId, callback) {
  var promise = daoSchemas.models.contests.findOne({ _feed: feedId, elementId: contestId })
    .populate('_ballotStyles')
    .exec();

  promise.then(function(contest) {
    callback(null, contest._ballotStyles);
  });
}

function getCandidateBallotStyles(feedId, candidateId, callback) {
  var promise = daoSchemas.models.candidates.findOne({ _feed: feedId, elementId: candidateId })
    .populate('_ballotStyles')
    .exec();

  promise.then(function(candidate) {
    callback(null, candidate._ballotStyles);
  });
}

function getOverviewTable(feedId, section, callback) {
  daoSchemas.models.overview.find({ _feed: feedId, section: section })
    .exec(callback);
}

function getCounties(stateId, callback) {
  daoSchemas.models.county.find({ stateFIPS: stateId }, callback);
}

function getCounty(countyId, callback) {
  daoSchemas.models.county.find({ countyFIPS: countyId }, callback);
}

exports.getFeeds = getFeedList;
exports.getFeedOverview = getFeedOverview;
exports.getFeedSource = getFeedSource;
exports.getFeedElection = getFeedElection;
exports.getFeedContestResults = getFeedContestResults;
exports.getFeedBallotLineResults = getFeedBallotLineResults;
exports.getElectionOfficial = getElectionOfficial;
exports.getFeedContests = getFeedContests;
exports.getState = getState;
exports.getStateEarlyVoteSites = getStateEarlyVoteSites;
exports.feedStateElectionAdministration = feedStateElectionAdministration;
exports.getLocalities = getLocalities;
exports.getLocality = getLocality;
exports.getLocalityEarlyVoteSite = getLocalityEarlyVoteSite;
exports.feedLocalityElectionAdministration = feedLocalityElectionAdministration;
exports.getLocalityPrecincts = getLocalityPrecincts;
exports.getLocalityPrecinct = getLocalityPrecinct;
exports.getLocalityPrecinctEarlyVoteSites = getLocalityPrecinctEarlyVoteSites;
exports.getPrecinctElectoralDistricts = getPrecinctElectoralDistricts;
exports.getPrecinctPollingLocations = getPrecinctPollingLocations;
exports.getPrecinctPrecinctSplits = getPrecinctPrecinctSplits;
exports.getPrecinctStreetSegments = getPrecinctStreetSegments;
exports.feedPrecinctSplit = feedPrecinctSplit;
exports.feedPrecinctSplitElectoralDistricts = feedPrecinctSplitElectoralDistricts;
exports.feedPrecinctSplitPollingLocations = feedPrecinctSplitPollingLocations;
exports.feedPrecinctSplitStreetSegments = feedPrecinctSplitStreetSegments;
exports.feedEarlyVoteSite = feedEarlyVoteSite;
exports.feedContest = feedContest;
exports.feedContestElectoralDistrict = feedContestElectoralDistrict;
exports.feedElectoralDistrict = feedElectoralDistrict;
exports.feedBallotCandidates = feedBallotCandidates;
exports.feedContestBallot = feedContestBallot;
exports.feedCandidate = feedCandidate;
exports.feedBallotReferenda = feedBallotReferenda;
exports.feedBallotReferendum = feedBallotReferendum;
exports.getPollingLocation = getPollingLocation;
exports.getContestResult = getContestResult;
exports.getContestBallotLineResults = getContestBallotLineResults;
exports.getBallotLineResult = getBallotLineResult;
exports.dbConnect = dbConnect;
exports.getOverviewTable = getOverviewTable;
exports.getContestBallotStyles = getContestBallotStyles;
exports.getCandidateBallotStyles = getCandidateBallotStyles;

exports.getCounties = getCounties;
exports.getCounty = getCounty;
