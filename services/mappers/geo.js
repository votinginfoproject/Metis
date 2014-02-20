/**
 * Created by bantonides on 2/18/14.
 */
const
  geojson = require('geojson');

function mapCounty(county) {
  return {
    stateFIPS: county.stateFIPS,
    countyFIPS: county.countyFIPS,
    name: county.name,
    fullName: county.fullName,
    polygon: JSON.parse(county.polygon),
    multipolygon: JSON.parse(county.multipolygon)
  };
}

function countiesToGeoJson(counties) {
  return geojson.parse(counties.map(mapCounty), {'Polygon': 'polygon', 'MultiPolygon': 'multipolygon'});
}

exports.countiesToGeoJson = countiesToGeoJson;