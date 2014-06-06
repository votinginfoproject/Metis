/**
 * Created by bantonides on 2/18/14.
 */
var dao = require('../dao/db');
var mapper = require('./mappers/geo');
var logger = (require('../logging/vip-winston')).Logger;

function stateCountiesGET(req, res) {
  dao.getCounties(req.params.stateId, mapAndReturnCounties.bind(undefined, res));
}

function countyGET(req, res) {
  dao.getCounty(req.params.countyId, mapAndReturnCounties.bind(undefined, res));
}

function mapAndReturnCounties(res, err, counties) {
  if (err) {
    logger.error(err);
    res.send(500);
  }
  else if (counties && counties.length > 0) {
    res.json(mapper.countiesToGeoJson(counties));
  }
  else {
    res.send(404);
  }
}

exports.stateCountiesGET = stateCountiesGET;
exports.countyGET = countyGET;