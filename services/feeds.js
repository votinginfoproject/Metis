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
};

/*
 * Callbacks for HTTP verbs
 */
allFeedsGET = function (req, res) {
  dao.getFeeds(function(arr, data) {
    res.json(_.map(data, function (data) {
      return mapper.mapFeed(req.path, data);
    }));
  });

};

feedOverviewGET = function (req, res) {
  res.json(mapper.mapFeedOverview(req.path, req.params.feedid));
};

feedSourceGET = function (req, res) {
  var source = {}; //TODO: get data from the database
  res.json(mapper.mapSource(req.path, source));
};

feedElectionGET = function (req, res) {
 var election = {}; //TODO: get data from the database
  res.json(mapper.mapElection(req.path, election));
};

exports.registerFeedsServices = registerFeedsServices;