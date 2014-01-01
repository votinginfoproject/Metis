/**
 * Created by nboseman on 12/23/13.
 */

var metisRules;
var ruler = require('./metisRule');



/* begin rule processing below refactor to separate modules/configurations later */

function processRules(){
  ruleCollection = [];

  //MetisRule 1: Check for uniqueness of IDs in the collection set
  var uniqueIDCheck = processUniqueID();

  //MetisRule 2: Retrieve all url-bound constraints from the rule def, verify they are valid
  var validUrlCheck = processValidUrl();

  ruleCollection.push(uniqueIDCheck, validUrlCheck);
  return ruleCollection;
}

function processUniqueID(){
  return ruler.getInstance(
    require.('./ruledefs').ruleDefinitions.uniqueIDCheck,
    require('./constraints').uniqueIDCheck.topLevelElements
  );
}

function processValidUrl(){
  return ruler.getInstance(
    require.('./ruledefs').ruleDefinitions.validUrlCheck,
    require('./constraints').validUrlCheck.topLevelElements.pollingLocation
  );
}