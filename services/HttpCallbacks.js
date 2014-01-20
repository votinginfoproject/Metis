/**
 * Created by rcartier13 on 1/14/14.
 */

var dao = require('../dao/db');
var mapper = require('./mappers/feed');

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
      res.json(mapper.mapPollingLocations(req.path, pollingLocations));
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

function feedPrecinctStreetSegmentsErrorsGET (req, res) {
  var streetSegments = {}; //TODO: get data from the database
  res.json(mapper.mapStreetSegmentsErrors(req.path, streetSegments));
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

function feedPrecinctSplitElectoralDistrictsGET (req, res) {
  dao.feedPrecinctSplitElectoralDistricts(req.params.feedid, req.params.splitid, function (err, electoralDistricts) {
    notFoundHandler(res, err, electoralDistricts, function () {
      res.json(mapper.mapElectoralDistricts(req.path, electoralDistricts));
    });
  });
};

function feedPrecinctSplitPollingLocationsGET (req, res) {
  dao.feedPrecinctSplitPollingLocations(req.params.feedid, req.params.splitid, function (err, pollingLocations) {
    notFoundHandler(res, err, pollingLocations, function () {
      res.json(mapper.mapPollingLocations(req.path, pollingLocations));
    });
  });
};

function feedPrecinctSplitStreetSegmentsGET (req, res) {
  dao.feedPrecinctSplitStreetSegments(req.params.feedid, req.params.splitid, function (err, streetSegments) {
    notFoundHandler(res, err, streetSegments, function () {
      res.json(mapper.mapStreetSegments(req.path, streetSegments));
    });
  });
};

function feedPrecinctSplitStreetSegmentsErrorsGET (req, res) {
  var streetSegments = {}; //TODO: get data from the database
  res.json(mapper.mapStreetSegmentsErrors2(req.path, streetSegments));
};

function feedEarlyVoteSiteGET (req, res) {
  dao.feedEarlyVoteSite (req.params.feedid, req.params.evsid, function (err, earlyVoteSite) {
    notFoundHandler(res, err, earlyVoteSite, function () {
      res.json(mapper.mapEarlyVoteSite(earlyVoteSite));
    });
  });
};

function feedStateElectionAdministrationGET (req, res) {
  dao.feedStateElectionAdministration(req.params.feedid, function (err, electionAdmin) {
    notFoundHandler(res, err, electionAdmin, function () {
      res.json(mapper.mapElectionAdministration(electionAdmin));
    });
  });
};

function feedLocalityElectionAdministrationGET (req, res) {
  dao.feedLocalityElectionAdministration(req.params.feedid, req.params.localityid, function (err, electionAdmin) {
    notFoundHandler(res, err, electionAdmin, function () {
      res.json(mapper.mapElectionAdministration(electionAdmin));
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

exports.allFeedsGET = allFeedsGET;
exports.feedOverviewGET = feedOverviewGET;
exports.feedSourceGET = feedSourceGET;
exports.feedElectionGET = feedElectionGET;
exports.feedStateGET = feedStateGET;
exports.feedStateEarlyVoteSitesGET = feedStateEarlyVoteSitesGET;
exports.feedLocalitiesGET = feedLocalitiesGET;
exports.feedLocalityGET = feedLocalityGET;
exports.feedLocalityEarlyVoteSitesGET = feedLocalityEarlyVoteSitesGET;
exports.feedLocalityPrecinctsGET = feedLocalityPrecinctsGET;
exports.feedPrecinctGET = feedPrecinctGET;
exports.feedPrecinctEarlyVoteSitesGET = feedPrecinctEarlyVoteSitesGET;
exports.feedPrecinctElectoralDistrictsGET = feedPrecinctElectoralDistrictsGET;
exports.feedPrecinctPollingLocationsGET = feedPrecinctPollingLocationsGET;
exports.feedPrecinctPrecinctSplitsGET = feedPrecinctPrecinctSplitsGET;
exports.feedPrecinctStreetSegmentsGET = feedPrecinctStreetSegmentsGET;
exports.feedPrecinctStreetSegmentsErrorsGET = feedPrecinctStreetSegmentsErrorsGET;
exports.feedPrecinctSplitGET = feedPrecinctSplitGET;
exports.feedPrecinctSplitElectoralDistrictsGET = feedPrecinctSplitElectoralDistrictsGET;
exports.feedPrecinctSplitPollingLocationsGET = feedPrecinctSplitPollingLocationsGET;
exports.feedPrecinctSplitStreetSegmentsGET = feedPrecinctSplitStreetSegmentsGET;
exports.feedPrecinctSplitStreetSegmentsErrorsGET = feedPrecinctSplitStreetSegmentsErrorsGET;
exports.feedEarlyVoteSiteGET = feedEarlyVoteSiteGET;
exports.feedElectionContestsGET = feedElectionContestsGET;
exports.feedStateElectionAdministrationGET = feedStateElectionAdministrationGET;
exports.feedLocalityElectionAdministrationGET = feedLocalityElectionAdministrationGET;
exports.feedPollingGET = feedPollingGET;
exports.feedContestsGET = feedContestsGET;
exports.feedResultsGET = feedResultsGET;
exports.feedHistoryGET = feedHistoryGET;