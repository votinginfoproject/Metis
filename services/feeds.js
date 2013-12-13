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
  app.get('/services/feeds/:id', utils.ensureAuthentication, feedOverviewGET)
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
  res.json(mapper.mapFeedOverview(req.path, req.params.id));
};

exports.registerFeedsServices = registerFeedsServices;