/**
 * Created by nboseman on 1/29/14.
 */

var when = require('when');
var matcher = new RegExp(/http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))/);

var evaluateValidUrl = function(urlString, dataSet, entity, constraintSet, ruleDef){
  var isViolated = false;
  if((urlString == null || urlString == "")){
    isViolated = true;
  }
  else {
    try {
      isViolated = !matcher.test(urlString);
    }
    catch(err){
      //console.log(err); doNothing
    }
  }
  return when.resolve({isViolated: isViolated, dataItem: constraintSet.fields + " = " + urlString, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
};

exports.evaluate = evaluateValidUrl;

