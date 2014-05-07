/**
 * Created by rcartier13 on 5/7/14.
 */

var evaluteMissingPollingLocation = function(pollingLocations, dataSet, entity, constraintSet, ruleDef, callback) {

  var isViolated = false;
  if(pollingLocations.length == 0) {
    isViolated = true;
  }

  callback( { isViolated: isViolated, dataItem: 'missing Polling Location', dataSet: dataSet, entity: entity, ruleDef: ruleDef } );

};

exports.evaluate = evaluteMissingPollingLocation;