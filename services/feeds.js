/**
 * Created by bantonides on 12/3/13.
 */
var utils = require('./utils');
var dao = require('../dao/db');
var mapper = require('./mappers/feed');
var _ = require('underscore');

var registerFeedsServices = function (app) {
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
  app.get('/services/feeds/:feedid/election/contests', utils.ensureAuthentication, feedElectionContestsGET);
  app.get('/services/feeds/:feedid/polling', utils.ensureAuthentication, feedPollingGET);
  app.get('/services/feeds/:feedid/contests', utils.ensureAuthentication, feedContestsGET);
  app.get('/services/feeds/:feedid/results', utils.ensureAuthentication, feedResultsGET);
  app.get('/services/feeds/:feedid/history', utils.ensureAuthentication, feedHistoryGET);
};

/*
 * Error handling middleware
 */
notFoundHandler = function (res, err, data, next) {
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
allFeedsGET = function (req, res) {
  dao.getFeeds(function (err, data) {
    res.json(_.map(data, function (data) {
      return mapper.mapFeed(req.path, data);
    }));
  });
};

feedOverviewGET = function (req, res) {
  dao.getFeedOverview(req.params.feedid, function (err, feed) {
    notFoundHandler(res, err, feed, function () {
      res.json(mapper.mapFeedOverview(req.path, feed))
    });
  });
};

feedSourceGET = function (req, res) {
  dao.getFeedSource(req.params.feedid, function (err, source) {
    notFoundHandler(res, err, source, function () {
      res.json(mapper.mapSource(req.path, source));
    });
  });
};

feedElectionGET = function (req, res) {
  dao.getFeedElection(req.params.feedid, function (err, election) {
    notFoundHandler(res, err, election, function () {
      res.json(mapper.mapElection(req.path, election));
    });
  });
};

feedStateGET = function (req, res) {
  dao.getState(req.params.feedid, function (err, state) {
    notFoundHandler(res, err, state, function () {
      res.json(mapper.mapState(req.path, state));
    });
  });
};

feedStateEarlyVoteSitesGET = function (req, res) {
  dao.getStateEarlyVoteSites(req.params.feedid, function (err, earlyVoteSites) {
    notFoundHandler(res, err, earlyVoteSites, function () {
      res.json(mapper.mapStateEarlyVoteSites(req.path, earlyVoteSites));
    });
  });
};

feedLocalityGET = function (req, res) {
  dao.getLocality(req.params.feedid, req.params.localityid, function (err, locality) {
    notFoundHandler(res, err, locality, function () {
      res.json(mapper.mapLocality(req.path, locality));
    });
  });

};

feedLocalitiesGET = function (req, res) {
  var locality = {}; //TODO: get data from the database
  res.json(mapper.mapLocalities(req.path, locality));
};

feedLocalityEarlyVoteSitesGET = function (req, res) {
  var earlyVoteSites = {}; //TODO: get data from the database
  res.json(mapper.mapLocalityEarlyVoteSites(req.path, earlyVoteSites));
};

feedLocalityPrecinctsGET = function (req, res) {
  var precincts = {}; //TODO: get data from the database
  res.json(mapper.mapLocalityPrecincts(req.path, precincts));
};

feedElectionContestsGET = function (req, res) {
  dao.getFeedContests(req.params.feedid, function (err, contests) {
    notFoundHandler(res, err, contests, function () {
      res.json(_.map(contests, function (data) {
        return mapper.mapElectionContest(req.path, data);
      }));
    });
  });
};

feedPollingGET = function (req, res) {
  var polling = {}; //TODO: get data from the database
  res.json(mapper.mapPollingSummary(req.path, polling));
};

feedContestsGET = function (req, res) {
  var contests = {}; //TODO: get data from the database
  res.json(mapper.mapContests(req.path, contests));
};

feedResultsGET = function (req, res) {
  var results = {}; //TODO: get data from the database
  res.json(mapper.mapResults(req.path, results));
};

feedHistoryGET = function (req, res) {
  var history = {}; //TODO: get data from the database
  res.json(mapper.mapHistory(req.path, history));
};

exports.registerFeedsServices = registerFeedsServices;