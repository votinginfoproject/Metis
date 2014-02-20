/**
 * Created by nboseman on 2/12/14.
 */

when = require('when');

var evaluateLocalityType = function(localityType, dataSet, entity, constraintSet, ruleDef){

  var isViolated = false;
  var localityTypesList = ['county','city','town','township','borough','parish','village','region'];

  if((localityType == null || localityType == "")){
    isViolated = false;
  }
  else {
    isViolated = (localityTypesList.indexOf(localityType) < 0);
  }
  return when.resolve({isViolated: isViolated, dataItem: constraintSet.fields + " = " + localityType, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateLocalityType;