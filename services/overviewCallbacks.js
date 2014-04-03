/**
 * Created by rcartier13 on 2/18/14.
 */

var dao = require('../dao/db');
var mapper = require('./mappers/feed.js');
var feedIdMapper = require('../feedIdMapper');

function notFoundHandler (res, err, data, next) {
  if (data == null) {
    res.send(404);
  }
  else {
    next();
  }
};

function contestOverviewGET(req, res) {
  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews));
    });
  });
}

function localityOverviewGET(req, res) {
  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), req.params.localityid, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews));
    });
  });
}

function localitiesOverviewGET (req, res) {
  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), -1, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews));
    });
  });
};

function contestsOverviewGET (req, res) {
  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), -2, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews));
    });
  });
};

function resultsOverviewGET (req, res) {
  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), -3, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews));
    });
  });
};

exports.contestOverviewGET = contestOverviewGET;
exports.localityOverviewGET = localityOverviewGET;
exports.localitiesOverviewGET = localitiesOverviewGET;
exports.contestsOverviewGET = contestsOverviewGET;
exports.resultsOverviewGET = resultsOverviewGET;