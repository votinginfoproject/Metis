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

  var selfpath; // = "/#/feeds/" + req.params.feedid + "/election/state/localities/" + req.params.localityid;
  selfpath = null;

  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), req.params.contestid, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews, selfpath));
    });
  });
}

function localityOverviewGET(req, res) {

  var selfpath = "/#/feeds/" + req.params.feedid + "/election/state/localities/" + req.params.localityid;
  selfpath = null;

  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), req.params.localityid, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews, selfpath));
    });
  });
}

function pollinglocationsOverviewGET (req, res) {

  var selfpath = "/#/feeds/" + req.params.feedid;

  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), -1, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews, selfpath));
    });
  });
};

function contestsOverviewGET (req, res) {

  var selfpath = "/#/feeds/" + req.params.feedid;

  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), -2, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews, selfpath));
    });
  });
};

function resultsOverviewGET (req, res) {

  var selfpath = "/#/feeds/" + req.params.feedid;

  dao.getOverviewTable(feedIdMapper.getId(req.params.feedid), -3, function(err, overviews) {
    notFoundHandler(res, err, overviews, function() {
      res.json(mapper.mapOverviewTables(overviews, selfpath));
    });
  });
};

exports.contestOverviewGET = contestOverviewGET;
exports.localityOverviewGET = localityOverviewGET;
exports.pollinglocationsOverviewGET = pollinglocationsOverviewGET;
exports.contestsOverviewGET = contestsOverviewGET;
exports.resultsOverviewGET = resultsOverviewGET;