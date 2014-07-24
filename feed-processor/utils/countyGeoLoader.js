/**
 * Created by bantonides on 2/17/14.
 *
 * Loads US County shapefile into Mongo database.
 * Designed for County (or equivalent) Shapefile from http://www.census.gov/cgi-bin/geo/shapefiles2013/main
 * The polygons in this shapefile were simplified before loading into Mongo to decrease file size.
 */
const
  fs = require('fs'),
  path = require('path'),
  shp = require('shapefile'),
  mongoose = require('mongoose'),
  config = require('../../config'),
  schemas = require('../../dao/schemas');

var logger = (require('../../logging/vip-winston')).Logger;

var refCount = 0;
var readComplete = false;

function parseShapefile(file) {
  connectMongo(readShapefile.bind(undefined, file));
}

function readShapefile(file) {
  shp.readStream(path.join(__dirname, file))
    .on('error', errorHandler)
    .on('feature', featureHandler)
    .on('end', onEnd)
}

connectMongo = function (next) {
  mongoose.connect(config.mongoose.connectionString);
  var db = mongoose.connection;
  db.on('error', logger.error.bind(logger, 'MongoDB connection error: '));
  db.once('open', function callback() {
    logger.info("initialized VIP database via Mongoose");
    schemas.initSchemas(mongoose);
    next();
  });
};

function featureHandler(feature) {
  saveCounty(feature.properties.STATEFP,
    feature.properties.GEOID,
    feature.properties.NAME,
    feature.properties.NAMELSAD,
    feature.geometry.coordinates,
    feature.geometry.type.toUpperCase().indexOf('MULTI') == 0);
}

function saveCounty(state, county, name, fullName, coordinates, isMulti) {
  refCount++;
  schemas.models.county.create({
    stateFIPS: state,
    countyFIPS: county,
    name: name,
    fullName: fullName,
    polygon: isMulti ? null : JSON.stringify(coordinates),
    multipolygon: isMulti? JSON.stringify(coordinates) : null
  }, onCreateComplete);
};

function errorHandler(err) {
  if (err) {
    logger.error(err);
    process.exit();
  }
}

function onCreateComplete(err) {
  refCount--;
  errorHandler(err);
  if (readComplete && refCount <= 0) {
    logger.info('Loading complete');
    process.exit();
  }
}

function onEnd() {
  readComplete = true;
}

if (process.argv.length > 2 && process.argv[2] != null) {
  parseShapefile(process.argv[2])
}
else {
  logger.error("ERROR: insufficient arguments provided \n");

  logger.info("Usage: node countyGeoLoader.js  <county_geojson_file>");
  logger.info("");
  process.exit();
}
