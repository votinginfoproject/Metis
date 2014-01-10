/**
 * Created by bantonides on 12/3/13.
 */
var utils = require('./utils');
var dao = require('../dao/db');
var mapper = require('./mappers/feed');

function registerFeedsServices (app) {
  /*
   * REST endpoints associated with Feed data
   */
  app.get('/services/feeds', utils.ensureAuthentication, allFeedsGET);
  app.get('/services/feeds/:feedid', utils.ensureAuthentication, feedOverviewGET);
  app.get('/services/feeds/:feedid/source', utils.ensureAuthentication, feedSourceGET);
  app.get('/services/feeds/:feedid/election', utils.ensureAuthentication, feedElectionGET);
  app.get('/services/feeds/:feedid/election/state', utils.ensureAuthentication, feedStateGET);
  app.get('/services/feeds/:feedid/election/state/earlyvotesites', utils.ensureAuthentication, feedStateEarlyVoteSitesGET);
  app.get('/services/feeds/:feedid/election/state/localities', utils.ensureAuthentication, feedLocalitiesGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid', utils.ensureAuthentication, feedLocalityGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/earlyvotesites', utils.ensureAuthentication, feedLocalityEarlyVoteSitesGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts', utils.ensureAuthentication, feedLocalityPrecinctsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid', utils.ensureAuthentication, feedPrecinctGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/earlyvotesites', utils.ensureAuthentication, feedPrecinctEarlyVoteSitesGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/electoraldistricts', utils.ensureAuthentication, feedPrecinctElectoralDistrictsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/pollinglocations', utils.ensureAuthentication, feedPrecinctPollingLocationsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits', utils.ensureAuthentication, feedPrecinctPrecinctSplitsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments', utils.ensureAuthentication, feedPrecinctStreetSegmentsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid', utils.ensureAuthentication, feedPrecinctSplitGET);
  app.get('/services/feeds/:feedid/election/contests', utils.ensureAuthentication, feedElectionContestsGET);
  app.get('/services/feeds/:feedid/polling', utils.ensureAuthentication, feedPollingGET);
  app.get('/services/feeds/:feedid/contests', utils.ensureAuthentication, feedContestsGET);
  app.get('/services/feeds/:feedid/results', utils.ensureAuthentication, feedResultsGET);
  app.get('/services/feeds/:feedid/history', utils.ensureAuthentication, feedHistoryGET);
};

/*
 * Error handling middleware
 */
function notFoundHandler (res, err, data, next) {
  if (data == null) {
    res.send(404);
  }
  else {
    next();
  }
};

/*
 * Callbacks for HTTP verbs
 */
function allFeedsGET (req, res) {
  dao.getFeeds(function (err, data) {
    res.json(data.map(function (data) {
      return mapper.mapFeed(req.path, data);
    }));
  });
};

function feedOverviewGET (req, res) {
  dao.getFeedOverview(req.params.feedid, function (err, feed) {
    notFoundHandler(res, err, feed, function () {
      res.json(mapper.mapFeedOverview(req.path, feed))
    });
  });
};

function feedSourceGET (req, res) {
  dao.getFeedSource(req.params.feedid, function (err, source) {
    notFoundHandler(res, err, source, function () {
      res.json(mapper.mapSource(req.path, source));
    });
  });
};

function feedElectionGET (req, res) {
  dao.getFeedElection(req.params.feedid, function (err, election) {
    notFoundHandler(res, err, election, function () {
      res.json(mapper.mapElection(req.path, election));
    });
  });
};

function feedStateGET (req, res) {
  dao.getState(req.params.feedid, function (err, state) {
    notFoundHandler(res, err, state, function () {
      res.json(mapper.mapState(req.path, state));
    });
  });
};

function feedStateEarlyVoteSitesGET (req, res) {
  dao.getStateEarlyVoteSites(req.params.feedid, function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function () {
      res.json(mapper.mapEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

function feedLocalityGET (req, res) {
  dao.getLocality(req.params.feedid, req.params.localityid, function (err, locality) {
    notFoundHandler(res, err, locality, function () {
      res.json(mapper.mapLocality(req.path, locality));
    });
  });
};

function feedLocalitiesGET (req, res) {
  dao.getLocalities(req.params.feedid, function (err, localities) {
    notFoundHandler(res, err, localities, function () {
      res.json(mapper.mapLocalities(req.path, localities));
    });
  });
};

function feedLocalityEarlyVoteSitesGET (req, res) {
  dao.getLocalityEarlyVoteSite(req.params.feedid, req.params.localityid, function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function () {
      res.json(mapper.mapEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

function feedLocalityPrecinctsGET (req, res) {
  dao.getLocalityPrecincts(req.params.feedid, req.params.localityid, function (err, precincts) {
    notFoundHandler(res, err, precincts, function () {
      res.json(mapper.mapLocalityPrecincts(req.path, precincts));
    });
  });
};

function feedPrecinctGET (req, res) {
  dao.getLocalityPrecinct(req.params.feedid, req.params.precinctid, function (err, precinct) {
    notFoundHandler(res, err, precinct, function() {
      res.json(mapper.mapPrecinct(req.path, precinct));
    });
  });
};

function feedPrecinctEarlyVoteSitesGET (req, res) {
  dao.getLocalityPrecinctEarlyVoteSites(req.params.feedid, req.params.precinctid, function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function() {
      res.json(mapper.mapEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

function feedPrecinctElectoralDistrictsGET (req, res) {
  dao.getPrecinctElectoralDistricts(req.params.feedid, req.params.precinctid, function (err, electoralDistricts) {
    notFoundHandler(res, err, electoralDistricts, function() {
      res.json(mapper.mapElectoralDistricts(req.path, electoralDistricts));
    });
  });
};

function feedPrecinctPollingLocationsGET (req, res) {
  dao.getPrecinctPollingLocations(req.params.feedid, req.params.precinctid, function (err, pollingLocations) {
    notFoundHandler(res, err, pollingLocations, function() {
      res.json(mapper.mapPrecinctPollingLocations(req.path, pollingLocations));
    });
  });
};

function feedPrecinctPrecinctSplitsGET (req, res) {
  dao.getPrecinctPrecinctSplits(req.params.feedid, req.params.precinctid, function (err, precinctSplits) {
    notFoundHandler(res, err, precinctSplits, function() {
      res.json(mapper.mapPrecinctPrecinctSplits(req.path, precinctSplits));
    });
  });
};

function feedPrecinctStreetSegmentsGET (req, res) {
  dao.getPrecinctStreetSegments(req.params.feedid, req.params.precinctid, function (err, streetSegments) {
    notFoundHandler(res, err, streetSegments, function() {
      res.json(mapper.mapStreetSegments(req.path, streetSegments));
    });
  });
};

function feedElectionContestsGET (req, res) {
  dao.getFeedContests(req.params.feedid, function (err, contests) {
    notFoundHandler(res, err, contests, function () {
      res.json(contests.map(function (data) {
        return mapper.mapElectionContest(req.path, data);
      }));
    });
  });
};

function feedPrecinctSplitGET (req, res) {
  dao.feedPrecinctSplit(req.params.feedid, req.params.splitid, function (err, split) {
    notFoundHandler(res, err, split, function () {
      res.json(mapper.mapPrecinctSplit(req.path, split));
    });
  });
};

function feedPollingGET (req, res) {
  var polling = {}; //TODO: get data from the database
  res.json(mapper.mapPollingSummary(req.path, polling));
};

function feedContestsGET (req, res) {
  var contests = {}; //TODO: get data from the database
  res.json(mapper.mapContests(req.path, contests));
};

function feedResultsGET (req, res) {
  var results = {}; //TODO: get data from the database
  res.json(mapper.mapResults(req.path, results));
};

function feedHistoryGET (req, res) {
  var history = {}; //TODO: get data from the database
  res.json(mapper.mapHistory(req.path, history));
};

exports.registerFeedsServices = registerFeedsServices;
