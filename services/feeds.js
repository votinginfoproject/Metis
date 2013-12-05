/**
 * Created by bantonides on 12/3/13.
 */
var utils = require('./utils');
var dao = require('../db');
var _ = require('underscore');

var registerFeedsServices = function (app) {
  /*
   * REST endpoints associated with Feed data
   */
  app.get('/services/feeds', utils.ensureAuthentication, allFeedsGET);
};

/*
 * Callbacks for HTTP verbs
 */
allFeedsGET = function (req, res) {
  dao.getFeeds(function(arr, data) {
    res.json(_.map(data, dao.mapFeeds));
  });

};

exports.registerFeedsServices = registerFeedsServices;